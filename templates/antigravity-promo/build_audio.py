import json
import math
import os
import re
import subprocess
import tempfile
import wave
import numpy as np

SR = 48000
FPS = 30
SHIFT = 0.14  # Clean punch lead-in before Take 01 begins

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(SCRIPT_DIR, "audio")
VO_WAV = os.path.join(AUDIO_DIR, "vo_stitched.wav")
WORDS_JSON = os.path.join(AUDIO_DIR, "vo.words.json")
LINES_JSON = os.path.join(AUDIO_DIR, "vo.lines.json")
SFX_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".agents", "skills", "media-use", "audio", "assets", "sfx"))
TMP_DIR = os.path.join(os.environ.get("TEMP", tempfile.gettempdir()), "antigravity-motion-promo")
os.makedirs(TMP_DIR, exist_ok=True)


def load_audio(path):
    tmp_wav = os.path.join(TMP_DIR, f"dec_{os.path.basename(path)}.wav")
    r = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "2", tmp_wav],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"ffmpeg decode failed for {path}: {r.stderr}")
    with wave.open(tmp_wav, "rb") as w:
        raw = w.readframes(w.getnframes())
    data = np.frombuffer(raw, dtype="<i2").astype(np.float64).reshape(-1, 2) / 32768.0
    try:
        os.remove(tmp_wav)
    except OSError:
        pass
    return data


def save_wav(path, stereo):
    stereo = np.clip(stereo, -0.995, 0.995)
    pcm = (stereo * 32767.0).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def build_beats():
    with open(WORDS_JSON, encoding="utf-8") as f:
        raw_words = json.load(f)
    with open(LINES_JSON, encoding="utf-8") as f:
        raw_lines = json.load(f)

    words = [{
        "i": i,
        "word": w["word"],
        "start": round(w["start"] + SHIFT, 4),
        "end": round(w["end"] + SHIFT, 4),
    } for i, w in enumerate(raw_words)]

    lines = [{
        "id": l["id"],
        "text": l["text"],
        "start": round(l["start"] + SHIFT, 4),
        "end": round(l["end"] + SHIFT, 4),
    } for l in raw_lines]

    def find_w(line_idx, target, occ=1):
        l = lines[line_idx]
        t_clean = re.sub(r"[^\w]", "", target.lower())
        count = 0
        for w in words:
            if w["start"] + 0.005 < l["start"] or w["end"] - 0.005 > l["end"]:
                continue
            w_clean = re.sub(r"[^\w]", "", w["word"].lower())
            if w_clean == t_clean:
                count += 1
                if count == occ:
                    return w
        raise KeyError(f"Word '{target}' (occ={occ}) not found in line {line_idx}: {l['text']}")

    def t_lead(w, lead=0.06):
        return max(0.0, round(w["start"] - lead, 4))

    # Map all 22 spoken lines to 22 visual scenes
    w1_perai, w1_tu, w1_so, w1_claude = find_w(0, "Peraí"), find_w(0, "tu"), find_w(0, "só"), find_w(0, "Claude")
    w2_comp, w2_nasa, w2_nivel = find_w(1, "computador"), find_w(1, "NASA"), find_w(1, "nível")
    w3_pensou, w3_errado, w3_parceiro = find_w(2, "Pensou"), find_w(2, "errado"), find_w(2, "parceiro")
    w4_eu, w4_abri, w4_after = find_w(3, "eu"), find_w(3, "abri"), find_w(3, "After")
    w5_nenhuma, w5_keyframe, w5_zero = find_w(4, "Nenhuma"), find_w(4, "keyframe"), find_w(4, "Zero")
    w6_quer, w6_gerou, w6_inteiro = find_w(5, "Quer"), find_w(5, "gerou"), find_w(5, "inteiro")
    w7_isso, w7_ag, w7_direto, w7_google = find_w(6, "Isso"), find_w(6, "Antigravity"), find_w(6, "Direto"), find_w(6, "Google")
    w8_eu, w8_nenhuma, w8_linha, w8_de, w8_cod = find_w(7, "eu"), find_w(7, "nenhuma"), find_w(7, "linha"), find_w(7, "de"), find_w(7, "código")
    w9_nao, w9_maq, w9_nasa, w9_gastar = find_w(8, "Não"), find_w(8, "máquina"), find_w(8, "NASA"), find_w(8, "gastar")
    w10_com, w10_certo, w10_pede, w10_quiser = find_w(9, "Com"), find_w(9, "certo"), find_w(9, "pede"), find_w(9, "quiser")
    w11_olha, w11_vire, w11_3d, w11_grav, w11_exp = find_w(10, "Olha"), find_w(10, "vire"), find_w(10, "3D"), find_w(10, "gravidade"), find_w(10, "exploda")
    w12_tu, w12_lit, w12_quiser = find_w(11, "Tu"), find_w(11, "literalmente"), find_w(11, "quiser")
    w13_so, w13_ag, w13_puro, w13_gen = find_w(12, "Só"), find_w(12, "Antigravity"), find_w(12, "puro"), find_w(12, "genérico")
    w14_se, w14_ag, w14_zerado, w14_sem, w14_nao, w14_sair = find_w(13, "Se"), find_w(13, "Antigravity"), find_w(13, "zerado"), find_w(13, "sem"), find_w(13, "não"), find_w(13, "sair")
    w15_porq, w15_cliente, w15_ia, w15_piloto = find_w(14, "Porque"), find_w(14, "cliente"), find_w(14, "IA"), find_w(14, "piloto")
    w16_ai, w16_entrega, w16_todo, w16_cara, w16_ia = find_w(15, "Aí"), find_w(15, "entrega"), find_w(15, "todo"), find_w(15, "cara"), find_w(15, "IA")
    w17_pra, w17_puro, w17_config, w17_certas = find_w(16, "Pra"), find_w(16, "puro"), find_w(16, "configurações"), find_w(16, "certas")
    w18_skills, w18_dir, w18_ref = find_w(17, "Skills"), find_w(17, "direção"), find_w(17, "referência")
    w19_so, w19_zero, w19_skills, w19_cam, w19_rit, w19_aud, w19_3d, w19_trab = (
        find_w(18, "Só"), find_w(18, "zero"), find_w(18, "skills"), find_w(18, "câmera"),
        find_w(18, "ritmo"), find_w(18, "áudio"), find_w(18, "3D"), find_w(18, "trabalho")
    )
    w20_princ, w20_se, w20_comec, w20_do, w20_zero = (
        find_w(19, "principalmente"), find_w(19, "se"), find_w(19, "começando"), find_w(19, "do"), find_w(19, "zero")
    )
    w21_mas, w21_fluxo, w21_ag, w21_nivel = find_w(20, "Mas"), find_w(20, "fluxo"), find_w(20, "Antigravity"), find_w(20, "nível")
    w22_entao, w22_comenta, w22_fluxo, w22_mostro, w22_completo = (
        find_w(21, "Então"), find_w(21, "comenta"), find_w(21, "FLUXO", 1), find_w(21, "mostro"), find_w(21, "completo")
    )

    raw_end = w22_completo["end"] + 1.05
    total_frames = int(math.ceil(raw_end * FPS))
    duration = round(total_frames / FPS, 6)

    s01_s = 0.0
    s02_s = round(lines[1]["start"] - 0.04, 4)
    s03_s = t_lead(w3_pensou, 0.10)
    s04_s = t_lead(find_w(3, "Cara"), 0.08)
    s05_s = t_lead(w5_nenhuma, 0.06)
    s06_s = t_lead(w6_quer, 0.08)
    s07_s = t_lead(w7_isso, 0.12)
    s08_s = t_lead(find_w(7, "E"), 0.08)
    s09_s = t_lead(w9_nao, 0.08)
    s10_s = t_lead(w10_com, 0.08)
    s11_s = t_lead(w11_olha, 0.08)
    s12_s = t_lead(w12_tu, 0.08)
    s13_s = t_lead(w13_so, 0.10)
    s14_s = t_lead(w14_se, 0.10)
    s15_s = t_lead(w15_porq, 0.08)
    s16_s = round(lines[15]["start"] - 0.06, 4)
    s17_s = t_lead(w17_pra, 0.10)
    s18_s = t_lead(w18_skills, 0.10)
    s19_s = t_lead(w19_so, 0.08)
    s20_s = t_lead(w20_princ, 0.06)
    s21_s = t_lead(w21_mas, 0.08)
    s22_s = t_lead(w22_entao, 0.10)

    scenes = {
        "s01": {"start": s01_s, "end": s02_s, "cues": {"perai": w1_perai["start"], "tu": w1_tu["start"], "so": w1_so["start"], "claude": w1_claude["start"]}},
        "s02": {"start": s02_s, "end": s03_s, "cues": {"comp": w2_comp["start"], "nasa": w2_nasa["start"], "nivel": w2_nivel["start"]}},
        "s03": {"start": s03_s, "end": s04_s, "cues": {"pensou": w3_pensou["start"], "errado": w3_errado["start"], "parceiro": w3_parceiro["start"]}},
        "s04": {"start": s04_s, "end": s05_s, "cues": {"eu": w4_eu["start"], "abri": w4_abri["start"], "after": w4_after["start"]}},
        "s05": {"start": s05_s, "end": s06_s, "cues": {"nenhuma": w5_nenhuma["start"], "keyframe": w5_keyframe["start"], "zero": w5_zero["start"]}},
        "s06": {"start": s06_s, "end": s07_s, "cues": {"quer": w6_quer["start"], "gerou": w6_gerou["start"], "inteiro": w6_inteiro["start"]}},
        "s07": {"start": s07_s, "end": s08_s, "cues": {"isso": w7_isso["start"], "antigravity": w7_ag["start"], "direto": w7_direto["start"], "google": w7_google["start"]}},
        "s08": {"start": s08_s, "end": s09_s, "cues": {"eu": w8_eu["start"], "nenhuma": w8_nenhuma["start"], "linha": w8_linha["start"], "de": w8_de["start"], "codigo": w8_cod["start"]}},
        "s09": {"start": s09_s, "end": s10_s, "cues": {"nao": w9_nao["start"], "maquina": w9_maq["start"], "nasa": w9_nasa["start"], "gastar": w9_gastar["start"]}},
        "s10": {"start": s10_s, "end": s11_s, "cues": {"com": w10_com["start"], "certo": w10_certo["start"], "pede": w10_pede["start"], "quiser": w10_quiser["start"], "sq_in": round(w10_quiser["end"] + 0.04, 4)}},
        "s11": {"start": s11_s, "end": s12_s, "cues": {"quadrado": w11_olha["start"], "vire3d": w11_vire["start"], "is3d": w11_3d["start"], "fly": round(w11_grav["start"] - 0.10, 4), "explode": round(w11_exp["start"] - 0.02, 4)}},
        "s12": {"start": s12_s, "end": s13_s, "cues": {"tu": w12_tu["start"], "literalmente": w12_lit["start"], "quiser": w12_quiser["start"]}},
        "s13": {"start": s13_s, "end": s14_s, "cues": {"so": w13_so["start"], "antigravity": w13_ag["start"], "puro": w13_puro["start"], "generico": w13_gen["start"]}},
        "s14": {"start": s14_s, "end": s15_s, "cues": {"se": w14_se["start"], "antigravity": w14_ag["start"], "zerado": w14_zerado["start"], "sem": w14_sem["start"], "nao": w14_nao["start"], "sair": w14_sair["start"]}},
        "s15": {"start": s15_s, "end": s16_s, "cues": {"cliente": w15_cliente["start"], "ia": w15_ia["start"], "piloto": w15_piloto["start"]}},
        "s16": {"start": s16_s, "end": s17_s, "cues": {"slop_full": s16_s, "grid_out": round(w16_entrega["start"] + 0.12, 4), "ig_card": round(w16_todo["start"] - 0.08, 4), "cara": w16_cara["start"], "de_ia": w16_ia["start"]}},
        "s17": {"start": s17_s, "end": s18_s, "cues": {"pra": w17_pra["start"], "puro": w17_puro["start"], "config": w17_config["start"], "certas": w17_certas["start"]}},
        "s18": {"start": s18_s, "end": s19_s, "cues": {"skills": w18_skills["start"], "direcao": w18_dir["start"], "referencia": w18_ref["start"]}},
        "s19": {"start": s19_s, "end": s20_s, "cues": {"so": w19_so["start"], "zero": w19_zero["start"], "blue_flash": w19_skills["start"], "skills": w19_skills["start"], "camera": w19_cam["start"], "ritmo": w19_rit["start"], "audio": w19_aud["start"], "d3": w19_3d["start"], "trabalho": w19_trab["start"]}},
        "s20": {"start": s20_s, "end": s21_s, "cues": {"principalmente": w20_princ["start"], "se": w20_se["start"], "comecando": w20_comec["start"], "do": w20_do["start"], "zero": w20_zero["start"]}},
        "s21": {"start": s21_s, "end": s22_s, "cues": {"mas": w21_mas["start"], "fluxo": w21_fluxo["start"], "antigravity": w21_ag["start"], "nivel": w21_nivel["start"]}},
        "s22": {"start": s22_s, "end": duration, "cues": {"entao": w22_entao["start"], "comenta": w22_comenta["start"], "fluxo": w22_fluxo["start"], "mostro": w22_mostro["start"], "completo": w22_completo["start"]}},
    }

    beats = {
        "fps": FPS,
        "duration": duration,
        "totalFrames": total_frames,
        "shift": SHIFT,
        "scenes": scenes,
        "lines": lines,
        "words": words,
    }
    with open(os.path.join(SCRIPT_DIR, "beats.js"), "w", encoding="utf-8") as f:
        f.write("window.BEATS = " + json.dumps(beats, indent=2, ensure_ascii=False) + ";\n")
    return beats


def synth_music(duration, drop_windows):
    """Crisp 126 BPM futuristic Google-tech / hip-hop beat."""
    n = int(round(duration * SR))
    t = np.arange(n, dtype=np.float64) / SR
    bpm = 126.0
    beat = 60.0 / bpm
    step16 = beat / 4.0
    bar = beat * 4.0

    # Modern upbeat-tech minor progression: Fm -> Db -> Bbm -> C7
    roots_bass = [43.654, 69.296, 58.270, 65.406]
    stereo = np.zeros((n, 2), dtype=np.float64)
    rng = np.random.default_rng(77)

    total_bars = int(math.ceil(duration / bar)) + 1
    for b in range(total_bars):
        t0 = b * bar
        root = roots_bass[b % 4]

        idx0 = int(round(t0 * SR))
        idx1 = min(n, int(round((t0 + bar) * SR)))
        if idx1 > idx0:
            bt = t[idx0:idx1] - t0
            pad_env = np.sin(np.pi * np.clip(bt / bar, 0, 1)) ** 0.45
            pad = (
                0.55 * np.sin(2 * np.pi * (root * 2.0) * bt) +
                0.30 * np.sin(2 * np.pi * (root * 3.0) * bt) +
                0.15 * np.sin(2 * np.pi * (root * 4.5) * bt)
            ) * pad_env * 0.04
            stereo[idx0:idx1, 0] += pad
            stereo[idx0:idx1, 1] += pad

        for s in range(16):
            st0 = t0 + s * step16
            if st0 >= duration:
                break

            kick_steps = [0, 3, 6, 10] if b % 2 == 0 else [0, 3, 7, 10, 14]
            if s in kick_steps:
                i0 = int(round(st0 * SR))
                i1 = min(n, int(round((st0 + 0.28) * SR)))
                if i1 > i0:
                    kt = t[i0:i1] - st0
                    pitch_env = np.exp(-kt * 38.0)
                    amp_env = np.exp(-kt * 8.5)
                    freq = root + 115.0 * pitch_env
                    kick = np.tanh(np.sin(2 * np.pi * freq * kt) * 1.35) * amp_env * 0.34
                    click = np.sin(2 * np.pi * 1650.0 * kt) * np.exp(-kt * 165.0) * 0.08
                    stereo[i0:i1, 0] += kick + click
                    stereo[i0:i1, 1] += kick + click

            if s in (4, 12):
                i0 = int(round(st0 * SR))
                i1 = min(n, int(round((st0 + 0.18) * SR)))
                if i1 > i0:
                    snt = t[i0:i1] - st0
                    hp = np.diff(rng.standard_normal(i1 - i0), prepend=0.0)
                    body = np.sin(2 * np.pi * (200.0 + 95.0 * np.exp(-snt * 55.0)) * snt) * np.exp(-snt * 28.0) * 0.16
                    snap = hp * np.exp(-snt * 22.0) * 0.13
                    stereo[i0:i1, 0] += body + snap
                    stereo[i0:i1, 1] += body + snap

            hat_hits = []
            if s % 2 == 0 or (b % 2 == 1 and s in (7, 11, 15)):
                hat_hits.append((st0, 0.06 if s % 4 == 0 else 0.036))
            if b % 2 == 1 and s == 14:
                hat_hits.append((st0 + step16 * 0.5, 0.032))
            for ht0, hgain in hat_hits:
                i0 = int(round(ht0 * SR))
                i1 = min(n, int(round((ht0 + 0.05) * SR)))
                if i1 > i0:
                    ht = t[i0:i1] - ht0
                    hn = np.diff(np.diff(rng.standard_normal(i1 - i0), prepend=0.0), prepend=0.0)
                    hat = hn * np.exp(-ht * 95.0) * hgain
                    pan = 0.58 if s % 4 == 0 else 0.42
                    stereo[i0:i1, 0] += hat * (1.0 - pan)
                    stereo[i0:i1, 1] += hat * pan

            if s in (2, 6, 9, 13):
                i0 = int(round(st0 * SR))
                i1 = min(n, int(round((st0 + 0.11) * SR)))
                if i1 > i0:
                    pt = t[i0:i1] - st0
                    mult = [2.0, 3.0, 2.5, 4.0][s % 4]
                    f0 = root * mult * 2.0
                    env = np.exp(-pt * 24.0)
                    pluck = (0.65 * np.sin(2 * np.pi * f0 * pt) + 0.25 * np.sin(2 * np.pi * f0 * 1.5 * pt)) * env * 0.06
                    pan = 0.35 if s in (2, 9) else 0.65
                    stereo[i0:i1, 0] += pluck * (1.0 - pan)
                    stereo[i0:i1, 1] += pluck * pan

    env_gain = np.ones(n, dtype=np.float64)
    ramp = int(0.025 * SR)
    for d0, d1 in drop_windows:
        i0 = max(0, int(round(d0 * SR)))
        i1 = min(n, int(round(d1 * SR)))
        if i1 <= i0 + 2 * ramp:
            continue
        env_gain[i0:i0 + ramp] = np.linspace(1.0, 0.04, ramp)
        env_gain[i0 + ramp:i1 - ramp] = 0.04
        env_gain[i1 - ramp:i1] = np.linspace(0.04, 1.0, ramp)
    return stereo * env_gain[:, None]


def synth_laser(dur=0.45):
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    f = 2400.0 * np.exp(-t * 9.5) + 140.0
    sig = np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * 2.2) * np.exp(-t * 9.0) * 0.44
    return np.column_stack([sig, sig])


def synth_stamp(dur=0.28):
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    rng = np.random.default_rng(7)
    thud = np.sin(2 * np.pi * (145.0 * np.exp(-t * 28.0) + 48.0) * t) * np.exp(-t * 18.0) * 0.72
    snap = rng.standard_normal(len(t)) * np.exp(-t * 65.0) * 0.25
    sig = np.tanh(thud + snap)
    return np.column_stack([sig, sig])


def synth_shatter(dur=1.15):
    t = np.arange(int(dur * SR), dtype=np.float64) / SR
    rng = np.random.default_rng(99)
    boom = np.sin(2 * np.pi * (120.0 * np.exp(-t * 14.0) + 36.0) * t) * np.exp(-t * 4.8) * 0.70
    shards = np.diff(rng.standard_normal(len(t)), prepend=0.0) * np.exp(-t * 5.5) * 0.24
    pings = np.zeros_like(t)
    for k in range(12):
        dt = k * 0.032
        mask = t >= dt
        tt = t[mask] - dt
        freq = 1600.0 + (k * 437) % 2800
        pings[mask] += np.sin(2 * np.pi * freq * tt) * np.exp(-tt * 28.0) * 0.08
    return np.column_stack([np.tanh(boom + shards + pings * 0.9), np.tanh(boom + np.roll(shards, 90) + np.roll(pings, 140) * 0.9)])


def synth_riser(dur=1.16):
    t = np.arange(max(1, int(round(dur * SR))), dtype=np.float64) / SR
    f = 180.0 * np.exp(t * np.log(1150.0 / 180.0) / max(0.05, dur))
    phase = 2 * np.pi * np.cumsum(f) / SR
    u = np.clip(t / max(0.05, dur), 0.0, 1.0)
    env = np.sin(0.5 * np.pi * u) ** 1.35
    fade_in = min(len(t) // 4, int(0.02 * SR))
    fade_out = min(len(t) // 4, int(0.035 * SR))
    if fade_in > 0:
        env[:fade_in] *= np.linspace(0.0, 1.0, fade_in)
    if fade_out > 0:
        env[-fade_out:] *= np.linspace(1.0, 0.0, fade_out)
    sig = (0.75 * np.sin(phase) + 0.25 * np.sin(2.0 * phase)) * env * 0.28
    return np.column_stack([sig, sig])


def trim_fade(clip, max_dur, fade_out=0.22, start_at=0.0):
    if clip is None:
        return None
    s0 = max(0, int(round(start_at * SR)))
    s1 = min(len(clip), s0 + int(round(max_dur * SR)))
    if s1 <= s0:
        return clip[:0]
    out = clip[s0:s1].copy()
    if start_at > 0:
        fin = min(len(out) // 4, int(0.025 * SR))
        if fin > 0:
            out[:fin] *= np.linspace(0.0, 1.0, fin)[:, None]
    fout = min(len(out), int(round(fade_out * SR)))
    if fout > 0:
        u = np.linspace(0.0, 1.0, fout)
        out[-fout:] *= (np.cos(0.5 * np.pi * u) ** 2)[:, None]
    return out


def add_clip(master, clip, t_sec, gain=1.0):
    i0 = int(round(t_sec * SR))
    if i0 < 0:
        clip = clip[-i0:]
        i0 = 0
    i1 = min(len(master), i0 + len(clip))
    length = i1 - i0
    if length > 0:
        master[i0:i1] += clip[:length] * gain


def main():
    beats = build_beats()
    dur = beats["duration"]
    sc = beats["scenes"]
    n = int(round(dur * SR))

    drops = [
        (sc["s06"]["end"] - 0.35, sc["s07"]["cues"]["antigravity"]),
        (sc["s11"]["cues"]["fly"] + 0.15, sc["s11"]["cues"]["explode"]),
        (sc["s16"]["cues"]["ig_card"] + 0.25, sc["s16"]["cues"]["cara"]),
        (sc["s17"]["cues"]["certas"], sc["s18"]["cues"]["skills"]),
    ]

    music = synth_music(dur, drops)
    vo_data = load_audio(VO_WAV)

    master = np.zeros((n, 2), dtype=np.float64)
    add_clip(master, vo_data, SHIFT, gain=1.18)

    vo_pad = np.zeros(n, dtype=np.float64)
    v0 = int(round(SHIFT * SR))
    v1 = min(n, v0 + len(vo_data))
    vo_pad[v0:v1] = np.max(np.abs(vo_data[:v1 - v0]), axis=1)
    win = int(0.18 * SR)
    env = np.convolve(vo_pad, np.ones(win) / win, mode="same")
    duck = 1.0 - 0.65 * np.clip(env * 14.0, 0.0, 1.0)
    master += music * duck[:, None]

    def sfx(name):
        p = os.path.join(SFX_DIR, name)
        return load_audio(p) if os.path.exists(p) else None

    s_imp1 = trim_fade(sfx("impact-bass-1.mp3"), 1.05, fade_out=0.55)
    s_imp2 = trim_fade(sfx("impact-bass-2.mp3"), 1.05, fade_out=0.55)
    s_wcin = trim_fade(sfx("whoosh-cinematic.mp3"), 1.85, fade_out=0.45, start_at=0.40)
    s_whoosh, s_ws = sfx("whoosh.mp3"), sfx("whoosh-short.mp3")
    s_riser = synth_riser(max(0.4, sc["s07"]["cues"]["antigravity"] - sc["s07"]["start"]))
    s_typ, s_click, s_pop = sfx("typing.mp3"), sfx("click.mp3"), sfx("pop.mp3")
    s_notif, s_sparkle, s_err = sfx("notification.mp3"), sfx("sparkle.mp3"), sfx("error.mp3")

    s_laser, s_stamp, s_shatter = synth_laser(), synth_stamp(), synth_shatter()

    sfx_list = [
        (s_imp1, 0.02, 0.46),
        (s_ws, sc["s01"]["cues"]["claude"], 0.45),
        (s_whoosh, sc["s02"]["start"], 0.50),
        (s_imp2, sc["s03"]["start"], 0.42),
        (s_err, sc["s03"]["cues"]["errado"], 0.35),
        (s_ws, sc["s04"]["start"], 0.40),
        (s_click, sc["s04"]["cues"]["after"], 0.45),
        (s_ws, sc["s05"]["start"], 0.45),
        (s_ws, sc["s06"]["start"], 0.36),
        (s_pop, sc["s06"]["cues"]["gerou"], 0.32),
        (s_riser, sc["s07"]["start"], 0.30),
        (s_laser, sc["s07"]["cues"]["antigravity"] - 0.04, 0.55),
        (s_imp1, sc["s07"]["cues"]["antigravity"], 0.52),
        (s_sparkle, sc["s07"]["cues"]["google"], 0.42),
        (s_whoosh, sc["s08"]["start"], 0.45),
        (s_typ, sc["s08"]["start"] + 0.15, 0.24),
        (s_imp2, sc["s08"]["cues"]["codigo"], 0.38),
        (s_wcin, sc["s09"]["start"], 0.40),
        (s_whoosh, sc["s10"]["start"], 0.45),
        (s_pop, sc["s10"]["cues"]["sq_in"], 0.55),
        (s_pop, sc["s11"]["cues"]["vire3d"], 0.50),
        (s_wcin, sc["s11"]["cues"]["fly"], 0.44),
        (s_shatter, sc["s11"]["cues"]["explode"], 0.85),
        (s_imp2, sc["s12"]["cues"]["quiser"], 0.38),
        (s_stamp, sc["s13"]["cues"]["puro"], 0.72),
        (s_stamp, sc["s13"]["cues"]["generico"], 0.72),
        (s_whoosh, sc["s14"]["start"], 0.45),
        (s_imp2, sc["s14"]["cues"]["antigravity"], 0.42),
        (s_typ, sc["s15"]["start"] + 0.1, 0.30),
        (s_click, sc["s15"]["cues"]["ia"] - 0.15, 0.55),
        (s_stamp, sc["s15"]["cues"]["piloto"], 0.62),
        (s_wcin, sc["s16"]["cues"]["grid_out"], 0.38),
        (s_notif, sc["s16"]["cues"]["ig_card"], 0.55),
        (s_stamp, sc["s16"]["cues"]["cara"], 0.82),
        (s_stamp, sc["s16"]["cues"]["de_ia"], 0.82),
        (s_whoosh, sc["s17"]["start"], 0.45),
        (s_imp1, sc["s17"]["cues"]["config"], 0.42),
        (s_laser, sc["s18"]["start"], 0.55),
        (s_pop, sc["s18"]["cues"]["referencia"], 0.55),
        (s_whoosh, sc["s19"]["cues"]["blue_flash"], 0.36),
        (s_laser, sc["s19"]["cues"]["blue_flash"], 0.24),
        (s_shatter, sc["s19"]["cues"]["trabalho"], 0.75),
        (s_ws, sc["s20"]["start"], 0.42),
        (s_whoosh, sc["s21"]["start"], 0.48),
        (s_pop, sc["s21"]["cues"]["fluxo"], 0.45),
        (s_notif, sc["s22"]["start"], 0.55),
        (s_click, sc["s22"]["cues"]["comenta"], 0.65),
        (s_sparkle, sc["s22"]["cues"]["fluxo"], 0.50),
    ]

    placed = 0
    for clip, t_sec, gain in sfx_list:
        if clip is not None:
            add_clip(master, clip, t_sec, gain)
            placed += 1

    fade_n = int(0.45 * SR)
    master[-fade_n:] *= np.linspace(1.0, 0.0, fade_n)[:, None]

    raw_wav = os.path.join(TMP_DIR, "raw_mix.wav")
    out_wav = os.path.join(AUDIO_DIR, "master_audio.wav")
    save_wav(raw_wav, master)

    # TRUE TWO-PASS FFmpeg loudnorm + lookahead ceiling so AAC stays strictly <= -1.0 dBTP
    p1 = subprocess.run([
        "ffmpeg", "-y", "-v", "info", "-i", raw_wav,
        "-af", "loudnorm=I=-14.8:TP=-2.8:LRA=7:print_format=json",
        "-f", "null", "-"
    ], capture_output=True, text=True, check=True)
    m = re.search(r"\{[\s\S]*?\}", p1.stderr)
    if not m:
        raise RuntimeError("Could not parse loudnorm pass 1 JSON")
    stats = json.loads(m.group(0))

    af2 = (
        f"loudnorm=I=-14.8:TP=-2.8:LRA=7:linear=true:"
        f"measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:"
        f"measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:"
        f"offset={stats['target_offset']},"
        f"alimiter=limit=0.72:attack=2:release=40:level=disabled"
    )
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", raw_wav,
        "-af", af2, "-ar", str(SR), "-ac", "2", out_wav
    ], check=True)

    # Export full-coverage inspection MP3s across all 90.40s
    audit_dir = os.path.join(TMP_DIR, "audit_master")
    os.makedirs(audit_dir, exist_ok=True)
    for idx, (s, d) in enumerate([(0, 31), (30, 31), (60, max(1.0, dur - 60))], 1):
        subprocess.run([
            "ffmpeg", "-y", "-v", "error", "-ss", str(s),
            "-t", str(d), "-i", out_wav, "-b:a", "192k", os.path.join(audit_dir, f"fixed_{idx}.mp3")
        ], check=True)

    r_eb = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", out_wav, "-af", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True
    )
    print(f"BEATS: {dur:.3f}s ({beats['totalFrames']} frames). Two-pass Master ({placed} SFX) -> {out_wav}")
    print(r_eb.stderr[r_eb.stderr.rfind("Summary:"):].strip())


if __name__ == "__main__":
    main()
