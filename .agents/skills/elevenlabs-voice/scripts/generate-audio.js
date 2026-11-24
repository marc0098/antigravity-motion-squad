#!/usr/bin/env node
// ElevenLabs Voice & Audio Generator
// Usage:
//   node --env-file=.env skills/elevenlabs-voice/scripts/generate-audio.js --text "Olá!" --out "audio.mp3"

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const API_BASE = 'https://api.elevenlabs.io/v1';
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  console.error('❌ Missing ELEVENLABS_API_KEY in environment / .env');
  process.exit(1);
}

// Curated top realistic voices for PT-BR (eleven_multilingual_v2)
export const PRESET_VOICES = {
  eric: 'cjVigY5qzO86Huf0OWal',    // Conversacional, didático, curioso e natural
  brian: 'nPczCjzI2devNBz1zQrb',   // Profundo, narrador de documentário/tech
  liam: 'TX3LPaxmHKxFdv7VOQHJ',    // Jovem, dinâmico, criador de conteúdo
  daniel: 'onwK4e9ZLuTAKqWW03F9',  // Editorial, firme e claro
};

function parseArgs(argv) {
  const args = {
    listVoices: false,
    text: '',
    file: '',
    out: 'output.mp3',
    voice: PRESET_VOICES.eric,
    model: 'eleven_multilingual_v2',
    stability: 0.34,
    similarity: 0.85,
    style: 0.48,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--list-voices') args.listVoices = true;
    else if (argv[i] === '--text' && argv[i + 1]) args.text = argv[++i];
    else if (argv[i] === '--file' && argv[i + 1]) args.file = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) args.out = argv[++i];
    else if (argv[i] === '--voice' && argv[i + 1]) {
      const v = argv[++i];
      args.voice = PRESET_VOICES[v.toLowerCase()] || v;
    }
    else if (argv[i] === '--model' && argv[i + 1]) args.model = argv[++i];
    else if (argv[i] === '--stability' && argv[i + 1]) args.stability = parseFloat(argv[++i]);
    else if (argv[i] === '--similarity' && argv[i + 1]) args.similarity = parseFloat(argv[++i]);
    else if (argv[i] === '--style' && argv[i + 1]) args.style = parseFloat(argv[++i]);
  }
  return args;
}

async function listVoices() {
  const res = await fetch(`${API_BASE}/voices`, {
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) throw new Error(`ElevenLabs error [${res.status}]: ${await res.text()}`);
  const data = await res.json();
  console.log(`🎙️ Vozes disponíveis (${data.voices.length}):`);
  for (const v of data.voices) {
    console.log(`  - ${v.name} | ID: ${v.voice_id} | Categoria: ${v.category}`);
  }
}

async function generateAudio({ text, file, out, voice, model, stability, similarity, style }) {
  const content = file ? readFileSync(resolve(file), 'utf-8') : text;
  if (!content.trim()) {
    console.error('❌ Provide --text "..." or --file path.txt');
    process.exit(1);
  }

  console.log(`🎙️ Gerando áudio com modelo ${model} (voz ${voice}, stability=${stability}, style=${style})...`);
  const res = await fetch(`${API_BASE}/text-to-speech/${voice}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: content,
      model_id: model,
      voice_settings: {
        stability,
        similarity_boost: similarity,
        style,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) throw new Error(`ElevenLabs TTS failed [${res.status}]: ${await res.text()}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = resolve(out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buffer);
  console.log(`✅ Áudio salvo com sucesso em: ${outPath} (${buffer.length} bytes)`);
}

const args = parseArgs(process.argv);
(args.listVoices ? listVoices() : generateAudio(args)).catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
