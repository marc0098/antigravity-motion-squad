#!/usr/bin/env node
// Gemini 3.8 Flash TTS Voiceover Generator
// Usage: node --env-file=.env skills/gemini-voice/scripts/generate-audio.js --text "..." --output "out.wav" [--voice Charon] [--lite]

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const PRESETS = {
  masc: {
    voice: "Puck",
    style:
      "Speak in a very natural, warm, relaxed Brazilian Portuguese conversational podcast tone, like a real tech creator talking casually close to a studio microphone, with natural breathing, slight vocal inflection and zero robotic announcer stiffness:",
  },
  friday: {
    voice: "Kore",
    style:
      "Speak in Brazilian Portuguese as a sleek, highly intelligent, calm, confident and subtly warm female AI assistant (like FRIDAY from Iron Man talking directly to Tony in his lab), clear studio microphone presence, natural human pacing and subtle breathing, zero robotic stiffness:",
  },
};

const DEFAULT_VOICE = PRESETS.masc.voice;
const DEFAULT_STYLE = PRESETS.masc.style;
const AVAILABLE_VOICES = [
  "Kore",
  "Puck",
  "Charon",
  "Fenrir",
  "Aoede",
  "Zephyr",
  "Orus",
  "Leda",
];

function parseArgs(argv) {
  const args = {
    text: "",
    output: "voiceover.wav",
    voice: DEFAULT_VOICE,
    style: DEFAULT_STYLE,
    preset: "",
    lite: false,
    listVoices: false,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--text" && argv[i + 1]) args.text = argv[++i];
    else if (argv[i] === "--output" && argv[i + 1]) args.output = argv[++i];
    else if (argv[i] === "--preset" && argv[i + 1]) args.preset = argv[++i];
    else if (argv[i] === "--voice" && argv[i + 1]) args.voice = argv[++i];
    else if (argv[i] === "--style" && argv[i + 1]) args.style = argv[++i];
    else if (argv[i] === "--lite") args.lite = true;
    else if (argv[i] === "--list-voices") args.listVoices = true;
  }
  if (args.preset && PRESETS[args.preset]) {
    args.voice = PRESETS[args.preset].voice;
    args.style = PRESETS[args.preset].style;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.listVoices) {
    console.log("Vozes disponíveis no Gemini 3.8 TTS:", AVAILABLE_VOICES.join(", "));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não encontrada no .env");
  }
  if (!args.text) {
    throw new Error('--text é obrigatório (ex.: --text "Fala pessoal!")');
  }

  const model = args.lite ? "gemini-3.8-flash-lite-tts" : "gemini-3.8-flash-tts";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  console.log(`🎙️ Gerando locução com ${model} (voz: ${args.voice})...`);

  const styledPrompt = args.style ? `${args.style}\n\n${args.text}` : args.text;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: styledPrompt }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: args.voice },
          },
        },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Gemini TTS erro [${res.status}]: ${JSON.stringify(data)}`);
  }

  const inline = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!inline?.data) {
    throw new Error(`Resposta sem áudio: ${JSON.stringify(data)}`);
  }

  const outPath = resolve(args.output);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(inline.data, "base64"));

  console.log(`✅ Áudio salvo em: ${outPath} (${inline.mimeType || "audio/wav"})`);
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
