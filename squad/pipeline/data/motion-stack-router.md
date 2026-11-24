# 🧭 Motion Stack Router — Arquitetura Funcional da `motion-design-squad`

Guia central de decisão entre **motores**, **estilos**, **engenharia de movimento**, **clonagem de referências** e **limites reais do hardware local** (`Node`, `Python 3.13`, `Chrome`, `ffmpeg`, `3,65 GB` RAM — sem `Blender` e sem `Bun` instalados).

---

## 1. Matriz de Responsabilidades por Agente

| Agente | Skills & Referências Principais | O que faz na prática |
| :--- | :--- | :--- |
| **🎬 Diretor de Motion** | `motion-reference-playbook.md` · `mg-styles-15` · `motionmaxxing` (`references/judgment.md`, `director.md`, `world.md`, `slop.md`) · `motion-design` | Escolhe o **arquétipo** + **estilo visual (`mg-styles-15`)**, define mundo cromático, luz, profundidade e trava anti-slop antes de gerar qualquer storyboard. |
| **📝 Roteirista & Storyboard** | `motionmaxxing` (`references/idea.md`, `library/moments.jsonl`, `references/sound-sync.md`) · `motion-reference-playbook.md` | Aplica a regra *"every beat buys one belief"* (`hook / turn / proof / cta`), planeja o objeto/gesto condutor entre cortes (*handoff*) e cronometra falas (~`2,5` a `3` palavras/s). |
| **🎙️ Assets & Áudio** | `gemini-voice` (padrão local gratuito) · `elevenlabs-voice` (opcional) · `media-use` (SFX locais) · `image-creator` · `motionmaxxing/scripts/brand.mjs` | Gera narração PT-BR limpa (`Puck` ou `Kore` via `gemini-voice --voice <Voz> --style " "`, removendo silêncios + `loudnorm`), captura marca de site quando houver URL (`brand.mjs` + `fetch_logo.mjs`) e separa SFX locais. |
| **⚡ Motion Designer** | **HyperFrames** (motor padrão) · **RAEA** (motor GPU Rust/Bevy p/ 3D, cortes sincronizados e React/TS) · **Remotion** (`remotion-*` p/ React/R3F/lote) · `mg-styles-15` · `reanimate` · `motionmaxxing` (`runtime/`, `scripts/render.mjs`, `references/motion.md`) | Constrói código 100% editável seguindo timing medido (`Expo Out`, `Back Out`, `Cubic In-Out`, chegada *oversize* sem bounce genérico), ou clona UI/WebGL fielmente via `reanimate`. Quando usar RAEA, compila composições React/TS direto na GPU Bevy. |
| **✅ QA & Render Final** | `hyperframes check` + `hyperframes audio` · `raea check` (safe zones, contraste, freezes e áudio nativo) · `ffprobe` / `ffmpeg ebur128` · `motionmaxxing` (`scripts/look.py`, `scripts/lint.mjs`, `references/judgment.md`, `references/slop.md`) · `reanimate` (sheets comparativos) | Faz validação dupla: técnica (`H.264/AAC`, `1080×1920`, `-16` a `-14 LUFS`, True Peak `≤ -1.0 dBTP`, `0` erros de check) e visual real em contact sheet / frames decodificados. |

---

## 2. Qual Motor e Stack Escolher

| Caso de Uso | Motor Recomendado | Complemento Principal |
| :--- | :--- | :--- |
| **Reels / Ads Comerciais / VSL curta / UI Showcase** | **HyperFrames** (`HTML + CSS + GSAP`) | `motionmaxxing` + `motion-reference-playbook.md` + `mg-styles-15` |
| **Reels Variado por Estilo** (Colagem, Isométrico, PaperClip, Hanazi, HUD) | **HyperFrames** | `mg-styles-15/prompts/<estilo>.md` adaptado para `1080×1920` |
| **Cenas 3D Complexas / Aceleração GPU Nativa / Cortes Sincronizados por Voz** | **RAEA** (`Rust + Bevy GPU + React/TS`) | `.agents/skills/raea` (`3d.md`, `motion.md`, `raea check`, `raea cut`) |
| **Vídeos em Lote / Dados Dinâmicos / React Three Fiber / Mapas** | **Remotion** (`remotion-best-practices` e irmãs) | `motion-design` + `mg-styles-15` |
| **Clonar Animação de Site, Botão, Bento Grid ou Cena WebGL de Referência** | **HyperFrames** ou stack do projeto | `reanimate` (análise frame-a-frame e tabela `spec.md` de curvas/timing) + `reverse-any-video` |
| **Hero Shot 3D Leve no Navegador** (objeto flutuante, câmera, bloom suave) | **HyperFrames** + Three.js | `motionmaxxing/runtime/hero3d` (já vem com Three.js + pós-processamento embutidos) |

---

## 3. Conciliação de Regras (`motionmaxxing` × Anúncios Reels BR)

O `motionmaxxing` foi calibrado originalmente para filmes SaaS widescreen (`slop.md`, `lint.mjs`), trazendo regras valiosas de acabamento — **aplicar com critério**:

1. **Adotar SEMPRE:**
   - Proibido "card minúsculo num vazio preto", texto que cresce de `scale(0)`, digitação letra-a-letra em headline, barras de progresso falsas, placas decorativas sem função ou *"Não é apenas X. É Y."* no roteiro.
   - Cortes acontecem **em movimento** (*cut on motion*), UI legível via zoom real de câmera (`scale` / `crop`), cada beat com 1 foco dominante (*1 hero per frame*) e transições causadas pela cena anterior.
2. **Adaptar ao Briefing Comercial de `@marcelo.vydo` (`9:16` Instagram/Shorts):**
   - `lint.mjs` (Gate G5) reprova *corners* e *end cards* > `1.4s` pensados para trailers de produto (`C1`, `C2`, `C6`, `G3`). Em anúncios de conversão e carrosséis/Reels de perfil BR onde o usuário pedir `@marcelo.vydo` fixo, selo de série ou CTA de comentário/seguir mais longo (`~2.5s–3.5s`), **mantenha a leitura clara da CTA** e use `lint.mjs` / `look.py` como auditoria diagnóstica (nunca para destruir uma CTA pedida pelo cliente).

---

## 4. Restrições Práticas do Ambiente Local (Importante!)

- **PC com `3,65 GB` RAM (`render` low-memory):**
  - No HyperFrames, renderize sempre com `--workers 1 --quality looks --browser-timeout 180`.
  - Evite rodar duas abas headless do Chrome ao mesmo tempo ou filtros pesados empilhados (`blur()` grande animado em 10+ nós).
  - Não deixe projetos 3D com `three.quarks` / múltiplas luzes volumétricas se `render` consumir memória em excesso — use `motionmaxxing/runtime/hero3d` apenas em `1` hero moment curto.
- **Skills e runtimes opcionais:**
  - `raea`: motor GPU nativo em Rust/Bevy (`.agents/skills/raea/`). Permite renderizar React/TypeScript sem peso do Chrome headless (`raea render`), fazer auditoria automática de safe zones e áudio (`raea check`) e cortes sincronizados com voz (`raea cut`). CLI instalado via `irm https://raea.io/install.ps1 | iex` (Windows).
  - `motionmaxxing`: scripts `lint.mjs` (`node`), `brand.mjs` (`node`) e `look.py` (`python` + `ffmpeg`) já funcionam no ambiente local. `voice.py` exige chave ElevenLabs; quando usar **`gemini-voice` (grátis)**, pule `voice.py`.
  - `reanimate`: toda a metodologia de inspeção visual, tabela `spec.md`, curvas de easing (`references/analysis.md`, `implementation.md`, `webgl.md`) e extração de frames com `ffmpeg` funciona imediatamente; os scripts `scripts/*.ts` exigem instalar **[Bun](https://bun.sh)** (`bun ...`) apenas se você quiser rodar captura/diff automático via Playwright + pixelmatch.
