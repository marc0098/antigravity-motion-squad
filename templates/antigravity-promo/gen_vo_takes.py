import argparse
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import wave
import numpy as np

SR = 48000
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PROJ_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(PROJ_DIR, "audio")
TAKES_DIR = os.path.join(os.environ.get("TEMP", tempfile.gettempdir()), "antigravity-motion-promo", "vo_takes")
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(TAKES_DIR, exist_ok=True)

STYLE = (
    "Speak in fast, energetic, charismatic, witty, commercial Brazilian Portuguese "
    "like a sharp tech creator speaking directly to camera with confident comedic timing, "
    "punchy emphasis, crisp studio microphone clarity, and zero robotic stiffness:"
)

TAKES = [
    {"id": 1,  "gap_after": 0.08, "display": "Peraí... tu tá achando que só o Claude...", "tts": "Peraí... tu tá achando que só o Claude..."},
    {"id": 2,  "gap_after": 0.28, "display": "ou um computador da NASA fazem um vídeo desse nível?", "tts": "ou um computador da NASA fazem um vídeo desse nível?"},
    {"id": 3,  "gap_after": 0.18, "display": "Pensou errado, meu parceiro!", "tts": "Pensou errado, meu parceiro!"},
    {"id": 4,  "gap_after": 0.14, "display": "Cara, eu não abri o After nenhuma vez pra fazer o que tu tá vendo aqui.", "tts": "Cara, eu não abri o Áfter nenhuma vez pra fazer o que tu tá vendo aqui."},
    {"id": 5,  "gap_after": 0.18, "display": "Nenhuma keyframe na mão. Zero dor de cabeça.", "tts": "Nenhuma quí-frêime na mão. Zero dor de cabeça!"},
    {"id": 6,  "gap_after": 0.26, "display": "Quer saber o que gerou esse vídeo inteiro?", "tts": "Quer saber o que gerou esse vídeo inteiro?"},
    {"id": 7,  "gap_after": 0.18, "display": "Isso aqui é Antigravity, meus amigos! Direto do Google, rapaz!", "tts": "Isso aqui é Antigravity, meus amigos! Direto do Google, rapaz!"},
    {"id": 8,  "gap_after": 0.16, "display": "E eu não escrevi nenhuma linha de código!", "tts": "E eu não escrevi nenhuma linha de código!"},
    {"id": 9,  "gap_after": 0.16, "display": "Não precisa de máquina da NASA nem gastar fortuna com ferramenta cara.", "tts": "Não precisa de máquina da NASA nem gastar fortuna com ferramenta cara!"},
    {"id": 10, "gap_after": 0.18, "display": "Com ele configurado do jeito certo, tu simplesmente pede o que tu quiser!", "tts": "Com ele configurado do jeito certo, tu simplesmente pede o que tu quiser!"},
    {"id": 11, "gap_after": 0.18, "display": "Olha esse quadrado aqui: quero que ele vire 3D, perca a gravidade... e exploda!", "tts": "Olha esse quadrado aqui! Quero que ele vire três dê, perca a gravidade! E EXPLODA!"},
    {"id": 12, "gap_after": 0.22, "display": "Tu pode pedir literalmente o que tu quiser, bicho!", "tts": "Tu pode pedir literalmente o que tu quiser, bicho!"},
    {"id": 13, "gap_after": 0.16, "display": "Só que calma lá... não foi só abrir o Antigravity puro e jogar um pedido genérico.", "tts": "Só que calma lá... não foi só abrir o Antigravity puro e jogar um pedido genérico."},
    {"id": 14, "gap_after": 0.16, "display": "Se tu chegar no Antigravity zerado, sem configurar nada, e pedir um vídeo igual esse... não vai sair!", "tts": "Se tu chegar no Antigravity zerado, sem configurar nada, e pedir um vídeo igual esse... não vai sair!"},
    {"id": 15, "gap_after": 0.14, "display": "Porque se tu pede igual cliente indeciso: \"faz um vídeo bem bacana aí\", a IA vai no piloto automático.", "tts": "Porque se tu pede igual cliente indeciso: faz um vídeo bem bacana aí... a I.A. vai no piloto automático!"},
    {"id": 16, "gap_after": 0.24, "display": "Aí não tem milagre: ela entrega o mesmo template que dá pra todo mundo... com cara de IA.", "tts": "Aí não tem milagre: ela entrega o mesmo template que dá pra todo mundo... com cara de I.A.!"},
    {"id": 17, "gap_after": 0.22, "display": "Pra chegar nesse nível, não basta só o Antigravity puro: tu precisa dele com as configurações certas:", "tts": "Pra chegar nesse nível, não basta só o Antigravity puro... tu precisa dele com as configurações certas:"},
    {"id": 18, "gap_after": 0.22, "display": "Skills, direção... e referência.", "tts": "Skills, direção... e referência!"},
    {"id": 19, "gap_after": 0.12, "display": "Só que configurar tudo isso do zero — skills, câmera, ritmo, áudio e 3D pra sair igual esse aqui — dá trabalho...", "tts": "Só que configurar tudo isso do zero — skills, câmera, ritmo, áudio e três dê pra sair igual esse aqui — dá trabalho..."},
    {"id": 20, "gap_after": 0.24, "display": "principalmente se você tá começando do zero.", "tts": "principalmente se você tá começando do zero."},
    {"id": 21, "gap_after": 0.22, "display": "Mas eu já montei esse fluxo inteiro rodando liso aqui no Antigravity — pronto pra criar nesse nível.", "tts": "Mas eu já montei esse fluxo inteiro rodando liso aqui no Antigravity, pronto pra criar nesse nível!"},
    {"id": 22, "gap_after": 0.0,  "display": "Então já comenta FLUXO aqui embaixo que eu te mostro o fluxo completo!", "tts": "Então já comenta FLUXO aqui embaixo que eu te mostro o fluxo completo!"},
]


def get_gemini_key():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k.strip()
    with open(os.path.join(ROOT, ".env"), encoding="utf-8") as f:
        for ln in f:
            if ln.strip().startswith("GEMINI_API_KEY="):
                return ln.strip().split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("GEMINI_API_KEY not found")


def tts_gemini_puck(api_key, text, out_raw_wav):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent?key={api_key}"
    # gemini-3.8-flash-lite-tts performs cleanest on pure PT-BR text (no English style prefix)
    payload = json.dumps({
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}},
        },
    }).encode("utf-8")
    for attempt in range(7):
        try:
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=90) as r:
                resp = json.loads(r.read().decode("utf-8"))
            b64 = resp["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
            with open(out_raw_wav, "wb") as f:
                f.write(base64.b64decode(b64))
            return
        except urllib.error.HTTPError as e:
            if attempt == 6:
                raise
            wait_s = (20.0 * (attempt + 1)) if e.code == 429 else (2.5 * (attempt + 1))
            print(f"  retry {attempt+1} after HTTP {e.code} (waiting {wait_s:.0f}s)")
            time.sleep(wait_s)
        except Exception as e:
            if attempt == 6:
                raise
            print(f"  retry {attempt+1} after error: {e}")
            time.sleep(2.5 * (attempt + 1))


def clean_take(raw_wav, clean_wav):
    # Convert to 48kHz stereo with highpass only (no FFmpeg silenceremove clipping!)
    tmp_wav = clean_wav + ".tmp.wav"
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", raw_wav,
        "-af", "highpass=f=75,loudnorm=I=-16:TP=-2.0:LRA=7",
        "-ar", str(SR), "-ac", "2", tmp_wav
    ], check=True)
    with wave.open(tmp_wav, "rb") as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64).reshape(-1, 2) / 32768.0
    try:
        os.remove(tmp_wav)
    except OSError:
        pass

    # Safe NumPy boundary trim: find FIRST sample > -48dB and LAST sample > -50dB
    mono = np.max(np.abs(data), axis=1)
    win = int(0.012 * SR)
    env = np.convolve(mono, np.ones(win) / win, mode="same")
    nz_start = np.where(env > 0.004)[0]
    nz_end = np.where(env > 0.0025)[0]
    if len(nz_start) > 0 and len(nz_end) > 0:
        i0 = max(0, int(nz_start[0]) - int(0.045 * SR))
        i1 = min(len(data), int(nz_end[-1]) + int(0.065 * SR))
        data = data[i0:i1].copy()

    # Apply 8ms edge micro-fades to prevent clicks
    fade = min(len(data) // 4, int(0.008 * SR))
    if fade > 0:
        data[:fade] *= np.linspace(0.0, 1.0, fade)[:, None]
        data[-fade:] *= np.linspace(1.0, 0.0, fade)[:, None]
    pcm = (np.clip(data, -0.99, 0.99) * 32767.0).astype("<i2")
    with wave.open(clean_wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    return data


def detect_speech_regions(wav_path, dur):
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", wav_path, "-af", "silencedetect=n=-38dB:d=0.11", "-f", "null", "-"],
        capture_output=True, text=True
    )
    sil = []
    cur = None
    for m in re.finditer(r"silence_(start|end): (-?[\d.]+)", r.stderr):
        v = max(0.0, float(m.group(2)))
        if m.group(1) == "start":
            cur = v
        elif cur is not None:
            sil.append((cur, v))
            cur = None
    if cur is not None:
        sil.append((cur, dur))
    regs, t = [], 0.0
    for s0, e0 in sil:
        if s0 - t > 0.03:
            regs.append((t, s0))
        t = max(t, e0)
    if dur - t > 0.03:
        regs.append((t, dur))
    return regs or [(0.0, dur)]


def estimate_word_timings(text, regs):
    raw_tokens = text.split()
    # Split into clause groups matching detected pauses when counts match
    clauses = [c.strip() for c in re.split(r"(?:\.\.\.|—|[:;!?])", text) if c.strip()]
    weights = [max(1.5, len(re.sub(r"[^\w]", "", tok)) + 1.2) for tok in raw_tokens]

    if len(regs) > 1 and len(clauses) == len(regs):
        out = []
        tok_idx = 0
        for cl, (r0, r1) in zip(clauses, regs):
            c_toks = cl.split()
            c_weights = weights[tok_idx:tok_idx + len(c_toks)]
            tot_w = sum(c_weights) or 1.0
            span = max(0.05, r1 - r0)
            cur = r0
            for j, wt in enumerate(c_weights):
                wdur = span * (wt / tot_w)
                out.append({"word": raw_tokens[tok_idx + j], "start": cur, "end": cur + wdur})
                cur += wdur
            tok_idx += len(c_toks)
        return out

    # Flatten across total active speech duration
    active_dur = sum(r1 - r0 for r0, r1 in regs)
    tot_w = sum(weights) or 1.0
    out = []
    acc = 0.0

    def map_active(a_t):
        rem = a_t
        for r0, r1 in regs:
            sp = r1 - r0
            if rem <= sp + 1e-6:
                return r0 + rem
            rem -= sp
        return regs[-1][1]

    for tok, wt in zip(raw_tokens, weights):
        wdur = active_dur * (wt / tot_w)
        out.append({"word": tok, "start": map_active(acc), "end": map_active(acc + wdur)})
        acc += wdur
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--retake", nargs="*", type=int, default=[])
    ap.add_argument("--only-stitch", action="store_true")
    args = ap.parse_args()

    api_key = get_gemini_key()
    all_audio = []
    words_out = []
    lines_out = []
    t_cursor = 0.0

    for tk in TAKES:
        idx = tk["id"]
        raw_wav = os.path.join(TAKES_DIR, f"take{idx:02d}.raw.wav")
        clean_wav = os.path.join(TAKES_DIR, f"take{idx:02d}.clean.wav")

        if not args.only_stitch and (idx in args.retake or not os.path.exists(raw_wav)):
            print(f"[{idx:02d}/22] Generating Puck take: {tk['display']}")
            tts_gemini_puck(api_key, tk["tts"], raw_wav)
            time.sleep(4.5)
        elif not os.path.exists(raw_wav):
            raise FileNotFoundError(raw_wav)

        # Always rebuild clean_wav if missing, retaken, or if script updated
        data = clean_take(raw_wav, clean_wav)

        dur = len(data) / SR
        regs = detect_speech_regions(clean_wav, dur)
        w_rel = estimate_word_timings(tk["display"], regs)

        lines_out.append({
            "id": idx,
            "text": tk["display"],
            "start": round(t_cursor, 4),
            "end": round(t_cursor + dur, 4),
            "dur": round(dur, 4),
        })
        for w in w_rel:
            words_out.append({
                "word": w["word"],
                "start": round(t_cursor + w["start"], 4),
                "end": round(t_cursor + w["end"], 4),
            })

        all_audio.append(data)
        gap_n = int(round(tk["gap_after"] * SR))
        if gap_n > 0:
            all_audio.append(np.zeros((gap_n, 2), dtype=np.float64))
        print(f"  Take {idx:02d}: {dur:.2f}s (regions={len(regs)}) @ {t_cursor:.2f}s -> {tk['display'][:52]}")
        t_cursor += dur + tk["gap_after"]

    stitched = np.concatenate(all_audio, axis=0)
    stitched_wav = os.path.join(AUDIO_DIR, "vo_stitched.wav")
    pcm = (np.clip(stitched, -0.99, 0.99) * 32767.0).astype("<i2")
    with wave.open(stitched_wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

    with open(os.path.join(AUDIO_DIR, "vo.words.json"), "w", encoding="utf-8") as f:
        json.dump(words_out, f, indent=1, ensure_ascii=False)
    with open(os.path.join(AUDIO_DIR, "vo.lines.json"), "w", encoding="utf-8") as f:
        json.dump(lines_out, f, indent=1, ensure_ascii=False)

    # Export 3 audit clips (~26s each) for mandatory full listening QA
    total_dur = len(stitched) / SR
    spans = [(0, 26, "audit_1.mp3"), (26, 52, "audit_2.mp3"), (52, total_dur + 0.5, "audit_3.mp3")]
    for a, b, name in spans:
        if a < total_dur:
            subprocess.run([
                "ffmpeg", "-y", "-v", "error", "-ss", str(a), "-t", str(b - a),
                "-i", stitched_wav, "-b:a", "192k", os.path.join(TAKES_DIR, name)
            ], check=True)

    print(f"\nStitched 22 takes -> {stitched_wav} ({total_dur:.2f}s). Audit MP3s ready in {TAKES_DIR}")


if __name__ == "__main__":
    main()
