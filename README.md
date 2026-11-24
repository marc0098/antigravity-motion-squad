# 🎬 Antigravity Motion Squad

> **Crie vídeos de Motion Design cinematográficos com código e IA, direto no Google Antigravity — sem abrir o After Effects.**

Este repositório contém a **arquitetura completa, o motor de renderização determinístico, os agentes especializados e os templates** desenvolvidos para criar animações de alto nível usando **GSAP + Three.js + Gemini TTS + Headless Chrome**.

Criado por [@marcelo.vydo](https://instagram.com/marcelo.vydo).

---

## 🚀 O que tem neste repositório?

1. **`squad/`**: Os 5 agentes autônomos que transformam o Antigravity em um estúdio completo de motion:
   - 🎬 **Diretor de Motion**: Analisa referências, define o conceito visual, o ritmo e o arquétipo.
   - 📝 **Roteirista & Storyboard**: Converte a mensagem em batidas cênicas e tempos exatos.
   - ⚡ **Motion Designer**: Escreve o código de animação declarativo em GSAP e WebGL 3D.
   - 🎵 **Assets & Áudio**: Orquestra locução com Gemini TTS / ElevenLabs, sintetiza beats e posiciona SFX.
   - 🔍 **QA & Render**: Executa testes de qualidade (G0, G2, G3), cortes em batidas e render 1080p.

2. **`.agents/skills/` & `skills/`**: O arsenal completo com **40 skills** especializadas:
   - 🏎️ **`motionmaxxing`**: Motor de direção, curvas de aceleração (`snapSettle`, `crashIn`), sincronia com batidas, renderização seek-safe e prevenção de clichés de IA.
   - 🎮 **`raea`**: Engine de vídeo e 3D de alta performance (materiais Bevy, matchmove, luzes, física e render GPU).
   - 🎨 **`mg-styles-15`**: 15 blueprints estéticos (Flat Vector, 3D CGI, Liquid Motion, Glassmorphism, Cyberpunk, Bauhaus, etc.).
   - 🔄 **`reverse-any-video`**: Recria qualquer vídeo de referência quadro a quadro em código.
   - 🎞️ **`reanimate`**: Engenharia reversa e reanimação de ativos de vídeo.
   - 🎙️ **`gemini-voice` & `elevenlabs-voice`**: Pipelines de locução neural e clonagem de voz.
   - 📐 **`figma`**: Importação de brand tokens, componentes e layouts do Figma para motion.
   - 🌐 **`hyperframes` (core, cli, registry)**: HTML renderizado para vídeo com mais de 450 blocos prontos.
   - ⚛️ **Suite `remotion-*` completa**: 14 skills para quem prefere criar e renderizar em React/TypeScript.
   - 🎛️ **`media-use`**: Criação de áudio, trilhas, sound design e color grading.

3. **`engine/`**: O motor de renderização frame a frame baseado no Chrome DevTools Protocol (`render.mjs`, `_cdp.mjs`) e auditoria de qualidade (`look.py`).
4. **`runtime/`**: Runtime seek-safe (`motion.js`) que garante que cada milissegundo de animação possa ser buscado deterministicamente sem saltos.
5. **`assets/`**: Pacote de fontes otimizadas (`.woff2`) e biblioteca essencial de sound effects (`whoosh`, `impact`, `pop`, `click`, `laser`, etc.).
6. **`templates/`**:
   - `antigravity-promo/`: O projeto completo do vídeo oficial (cubo 3D Google que flutua e explode em 140 shards, cards sociais, efeitos de luz e terminal de código).
   - `starter/`: Template em branco pronto para você colar seu roteiro e gerar um vídeo novo em minutos.

---

## 🛠️ Pré-requisitos & Instalação

O motor roda em qualquer sistema operacional (**Windows, macOS ou Linux**).

### 1. Dependências do Sistema

Certifique-se de ter instalado:
- **Node.js** (v18 ou superior): [nodejs.org](https://nodejs.org/)
- **Python** (v3.10 ou superior): [python.org](https://python.org/)
- **FFmpeg**: Necessário para combinar os frames e áudio em MP4.
  - *Windows*: `winget install Gyan.FFmpeg` ou via [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/)
  - *macOS*: `brew install ffmpeg`
  - *Linux*: `sudo apt install ffmpeg`
- **Google Chrome** (ou Microsoft Edge / Chromium): Usado pelo motor headless para renderização determinística quadro a quadro.

### 2. Instalação das Dependências

Abra o terminal na pasta do projeto e rode:

```bash
# 1. Dependências Node.js (se houver pacotes adicionais)
npm install

# 2. Dependências Python para inspeção de frames e QA
pip install numpy pillow requests
```

### 3. Configuração de Variáveis de Ambiente (`.env`)

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
Abra o `.env` e preencha suas chaves caso deseje gerar novas locuções com voz neural:
- `GEMINI_API_KEY`: Para usar o Gemini 3.8 Flash TTS gratuito/pago.
- `ELEVENLABS_API_KEY`: Se preferir ElevenLabs para clonagem e vozes realistas.

> 💡 **Nota sobre o Chrome no Windows:** Se o comando de render acusar `Google Chrome not found`, defina a variável no terminal ou no `.env`:
> ```powershell
> $env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
> ```

---

## ⚡ Guia Rápido (3 Passos)

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/antigravity-motion-squad.git
cd antigravity-motion-squad
```

### 2. Visualizar no navegador
Para abrir o servidor local e ver a animação rodando ao vivo:
```bash
npm run serve:starter
```
Acesse `http://localhost:8766` no seu navegador. Você pode dar play, pausar e inspecionar os elementos com o F12.

### 3. Renderizar o vídeo final (MP4 1080p)
Para compilar o HTML/GSAP em um arquivo `.mp4` com máxima qualidade:
```bash
npm run render:starter
```
O arquivo será gerado em `dist/starter.mp4`.

---

## 🤖 Como usar com o Google Antigravity

Se você usa o **Google Antigravity**, basta abrir esta pasta como seu workspace:

```bash
cd antigravity-motion-squad
agy
```

O Antigravity detectará automaticamente as pastas `.agents/skills/motionmaxxing` e `squad/`. Você pode pedir comandos como:

> *"Quero criar um vídeo de 15 segundos apresentando meu novo SaaS no estilo do template antigravity-promo. O tom deve ser tecnológico e rápido."*

O agente utilizará as regras de **timing, easing (snapSettle, crashIn), hierarquia visual e tipografia condensa** da skill `motionmaxxing` para construir a coreografia sem alucinações.

---

## 🎙️ Como funciona a Locução e Áudio

No template `templates/antigravity-promo`:
1. **Locução**: Usamos o script `gen_vo_takes.py` que chama a API do **Gemini 3.8 Flash TTS** com a voz `Puck` (ou ElevenLabs). O áudio é gravado frase a frase e sincronizado com margens seguras.
2. **Mapa de Batidas (`beats.js`)**: As palavras faladas geram marcadores de tempo em milissegundos.
3. **Coreografia no GSAP (`scenes.js`)**: As animações não usam delays arbitrários; elas entram exatamente no frame em que a voz pronuncia cada palavra (`SC.s01.cues.palavra`).
4. **Masterização (`build_audio.py`)**: Combina locução, trilha de sintetizador e SFX com ducking dinâmico e normalização profissional (`-14.5 LUFS`).

---

## 🧪 Checklist de Qualidade (Gates)

O script `engine/look.py` roda uma inspeção visual e auditiva automática no vídeo gerado:

- **G0 (Render)**: Verifica se a duração bate com o áudio e se o stream está íntegro.
- **G2 (No Empty Frame)**: Garante que nenhuma cena tenha mais de 3 frames travados ou tela preta acidental.
- **G3 (End Card Hold)**: Garante que o CTA final fique visível entre 0.6s e 1.4s, sem estourar 25% do tempo total.
- **Áudio LUFS**: Valida se o áudio está no padrão comercial broadcast (entre -14 e -16 LUFS) sem inter-sample clipping.

---

## 🤝 Autor & Créditos

Desenvolvido por **Marcelo Vydo**  
- Instagram: [@marcelo.vydo](https://instagram.com/marcelo.vydo)  
- Portfólio & Projetos: [vydo.com.br](https://vydo-code.vercel.app)

Dúvidas ou sugestões? Abra uma issue ou mande uma DM com a palavra **FLUXO**!
