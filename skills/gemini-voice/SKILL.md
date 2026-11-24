---
name: gemini-voice
description: Gera locuções em português usando os modelos de voz do Google AI Studio (`gemini-3.8-flash-tts` e `gemini-3.8-flash-lite-tts`) com os presets oficiais do Marcelo (`masc` / Puck e `friday` / Kore).
---

# Gemini Voice (Google AI Studio TTS)

Gera arquivos `.wav` naturais e expressivos em português usando a API oficial do Google AI Studio (`GEMINI_API_KEY`).

## Presets Oficiais Salvos
- **`--preset masc`** *(padrão)*: Voz masculina **`Puck`** — tom conversacional de podcast/criador de tecnologia.
- **`--preset friday`**: Voz feminina **`Kore`** — estilo Sexta-Feira (FRIDAY) do Tony Stark, calma, inteligente e sofisticada.

## Uso rápido

```bash
# Voz masculina oficial (Puck)
node --env-file=.env skills/gemini-voice/scripts/generate-audio.js \
  --preset masc \
  --text "Fala galera! <breath> Olha essa ferramenta nova de IA." \
  --output "squads/motion-design-squad/output/locucao.wav"

# Voz feminina estilo Sexta-Feira (Kore)
node --env-file=.env skills/gemini-voice/scripts/generate-audio.js \
  --preset friday \
  --text "Sistemas online, Marcelo. <short pause> Tudo pronto para o próximo vídeo." \
  --output "squads/motion-design-squad/output/friday.wav"
```

## Outras opções
- `--voice`: `Kore`, `Puck`, `Charon`, `Fenrir`, `Aoede`, `Zephyr`, `Orus`, `Leda`
- `--lite`: usa `gemini-3.8-flash-lite-tts` (mais rápido e econômico)
- `--list-voices`: lista as vozes disponíveis
