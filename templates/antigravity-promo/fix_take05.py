import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
import wave
import numpy as np

PROJ_DIR = os.path.dirname(os.path.abspath(__file__))
if PROJ_DIR not in sys.path:
    sys.path.insert(0, PROJ_DIR)

from gen_vo_takes import SR, AUDIO_DIR, TAKES_DIR, STYLE, get_gemini_key, clean_take

SLOT_START_S = 10.6091
SLOT_END_S = 12.9454
DEFAULT_TEXT = "Nenhuma quí-frêime na mão. Zero dor de cabeça."


def read_wav_stereo(path):
    with wave.open(path, "rb") as w:
        assert w.getframerate() == SR, f"Expected {SR}Hz, got {w.getframerate()}"
        assert w.getnchannels() == 2, f"Expected 2ch, got {w.getnchannels()}"
        raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype="<i2").astype(np.float64).reshape(-1, 2) / 32768.0


def write_wav_stereo(path, data):
    pcm = (np.clip(data, -0.995, 0.995) * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def apply_fades(arr, fade_in_ms=8.0, fade_out_ms=8.0):
    out = arr.copy()
    fin = min(len(out) // 4, int(round(fade_in_ms * 0.001 * SR)))
    fout = min(len(out) // 4, int(round(fade_out_ms * 0.001 * SR)))
    if fin > 0:
        out[:fin] *= np.linspace(0.0, 1.0, fin)[:, None]
    if fout > 0:
        out[-fout:] *= np.linspace(1.0, 0.0, fout)[:, None]
    return out


def cmd_generate_flash(text):
    raw_wav = os.path.join(TAKES_DIR, "take05_flash.raw.wav")
    clean_wav = os.path.join(TAKES_DIR, "take05_flash.clean.wav")
    api_key = get_gemini_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key={api_key}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": f"{STYLE}\n\n{text}"}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}},
        },
    }).encode("utf-8")

    print(f"Calling gemini-3.8-flash-tts (Puck) for Take 05: {text}")
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=60) as r:
                resp = json.loads(r.read().decode("utf-8"))
            b64 = resp["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
            with open(raw_wav, "wb") as f:
                f.write(base64.b64decode(b64))
            data = clean_take(raw_wav, clean_wav)
            print(f"FLASH_OK dur={len(data) / SR:.4f}s path={clean_wav}")
            return
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")[:200]
            print(f"HTTP {e.code} on gemini-3.8-flash-tts: {body}")
            if e.code == 429 or attempt == 1:
                print("FLASH_429_OR_FAIL")
                sys.exit(2)
        except Exception as e:
            print(f"Error on gemini-3.8-flash-tts: {e}")
            if attempt == 1:
                sys.exit(2)


def cmd_build_hybrid():
    orig_p = os.path.join(TAKES_DIR, "take05.clean.wav")
    fix_p = os.path.join(TAKES_DIR, "take05_fix.clean.wav")
    hyb_p = os.path.join(TAKES_DIR, "take05_hybrid.clean.wav")

    c1_src = read_wav_stereo(orig_p)
    c2_src = read_wav_stereo(fix_p)

    # Clause 1 ends in -38dB gap (1.015s..1.132s) -> cut cleanly at 1.035s
    c1 = apply_fades(c1_src[:int(round(1.035 * SR))], fade_in_ms=4.0, fade_out_ms=8.0)

    # Clause 2 starts after 1.814s silence -> keep ALL of tail from 1.810s to end so final '-a' in "cabeça" is 100% preserved
    c2_tail = c2_src[int(round(1.810 * SR)):].copy()
    mono = np.max(np.abs(c2_tail), axis=1)
    win = int(0.012 * SR)
    env = np.convolve(mono, np.ones(win) / win, mode="same")
    nz_start = np.where(env > 0.004)[0]
    if len(nz_start) > 0:
        i0 = max(0, int(nz_start[0]) - int(0.015 * SR))
        c2 = c2_tail[i0:].copy()
    else:
        c2 = c2_tail

    d2 = len(c2) / SR
    print(f"Hybrid parts: C1={len(c1)/SR:.4f}s, C2_raw={d2:.4f}s")
    if d2 > 1.15:
        ratio = d2 / 1.15
        if ratio > 1.18:
            raise RuntimeError(f"Clause 2 too long ({d2:.4f}s, ratio={ratio:.2f})")
        c2_tmp_in = os.path.join(TAKES_DIR, "take05_c2_raw.wav")
        c2_tmp_out = os.path.join(TAKES_DIR, "take05_c2_tempo.wav")
        write_wav_stereo(c2_tmp_in, c2)
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-i", c2_tmp_in,
            "-af", f"atempo={ratio:.6f}", "-ar", str(SR), "-ac", "2", c2_tmp_out
        ], check=True)
        c2 = read_wav_stereo(c2_tmp_out)
        print(f"Applied atempo={ratio:.4f} on C2 -> {len(c2)/SR:.4f}s")

    c2 = apply_fades(c2, fade_in_ms=8.0, fade_out_ms=8.0)
    gap = np.zeros((int(round(0.045 * SR)), 2), dtype=np.float64)
    hybrid = np.concatenate([c1, gap, c2], axis=0)
    write_wav_stereo(hyb_p, hybrid)
    print(f"HYBRID_OK dur={len(hybrid)/SR:.4f}s path={hyb_p}")


def cmd_splice(wav_path):
    vo_path = os.path.join(AUDIO_DIR, "vo_stitched.wav")
    bak_path = os.path.join(TAKES_DIR, "vo_stitched.bak.wav")
    if not os.path.exists(bak_path):
        shutil.copy2(vo_path, bak_path)
        print(f"Backed up original VO -> {bak_path}")

    base = read_wav_stereo(bak_path).copy()
    orig_len = len(base)
    fix = read_wav_stereo(wav_path).copy()
    d_new = len(fix) / SR

    if d_new > 2.25:
        ratio = d_new / 2.20
        if ratio > 1.18:
            raise RuntimeError(f"Clip too long ({d_new:.3f}s, ratio={ratio:.2f})")
        tmp_tempo = os.path.join(TAKES_DIR, "take05_fix.tempo.wav")
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-i", wav_path,
            "-af", f"atempo={ratio:.6f}", "-ar", str(SR), "-ac", "2", tmp_tempo
        ], check=True)
        fix = read_wav_stereo(tmp_tempo).copy()
        print(f"Applied transparent atempo={ratio:.4f}: {d_new:.4f}s -> {len(fix) / SR:.4f}s")

    i0 = int(round(SLOT_START_S * SR))
    i1 = int(round(SLOT_END_S * SR))
    if len(fix) > (i1 - i0) - int(0.05 * SR):
        raise RuntimeError(f"Scaled clip {len(fix)} samples exceeds slot budget {i1 - i0}")

    fix = apply_fades(fix, fade_in_ms=5.0, fade_out_ms=5.0)
    base[i0:i1] = 0.0
    base[i0:i0 + len(fix)] = fix
    assert len(base) == orig_len, f"Sample count mismatch: {len(base)} != {orig_len}"
    write_wav_stereo(vo_path, base)
    print(f"SPLICE_OK spliced={len(fix)/SR:.4f}s into [{SLOT_START_S:.4f}s..{SLOT_END_S:.4f}s] samples={orig_len}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--generate-flash", action="store_true")
    p.add_argument("--build-hybrid", action="store_true")
    p.add_argument("--splice", nargs="?", const=os.path.join(TAKES_DIR, "take05_flash.clean.wav"), default=None)
    p.add_argument("--text", default=DEFAULT_TEXT)
    args = p.parse_args()
    if args.generate_flash:
        cmd_generate_flash(args.text)
    if args.build_hybrid:
        cmd_build_hybrid()
    if args.splice:
        cmd_splice(args.splice)


if __name__ == "__main__":
    main()
