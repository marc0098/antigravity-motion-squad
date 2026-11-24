---
name: mg-styles-15
description: Catalog and style blueprints for 15 distinct motion-design aesthetics (Flat Vector, Line Art, Isometric 2.5D, 3D Render CGI, Cel Animation & Line Boil, Collage Cutout, Liquid Motion, Shape Morph, Bauhaus Geometric, 80s Synthwave / Y2K, Aurora Glassmorphism, Variety Show Hanazi Captions, Bold-Outline PaperClip Explainer, Pixel Art 8-bit, and Cyberpunk HUD/FUI). Use when choosing a visual direction, breaking repetitive templates, or translating a specific motion style into HyperFrames or Remotion scenes.
---

# MG Styles 15 — Catálogo de 15 Estilos de Motion Design

Baseado em `Vincentwei1021/mg-styles-15` (blueprints completos em `prompts/*.md`). Todo estilo abaixo pode ser adaptado para **Reels/Shorts (`1080×1920`, `9:16`)** ou **Landscape (`1920×1080`, `16:9`)** usando **HyperFrames** (padrão) ou **Remotion**.

---

## Tabela de Escolha Rápida (15 Estilos)

| # | Arquivo | Estilo | DNA Visual & Movimento | Melhor uso para `@marcelo.vydo` |
| :-: | :--- | :--- | :--- | :--- |
| 01 | [01-flat-vector.md](prompts/01-flat-vector.md) | **Flat / Vector 2D** | Planos geométricos vetoriais em câmera contínua (*one-shot*), cor sólida chapada, morfose gráfica limpa | Explicadores institucionais rápidos, transição de conceitos |
| 02 | [02-line-art.md](prompts/02-line-art.md) | **Line Art / Traço Único** | Linha vetorial contínua (`stroke-dashoffset`), desenho auto-traçado minimalista de alta elegância | Manifesto de marca, explicação de fluxo ou arquitetura |
| 03 | [03-isometric.md](prompts/03-isometric.md) | **Isometric / 2.5D** | Blocos isométricos modulares que crescem e se conectam em perspectiva 2.5D sobre grade técnica | Workflows multi-ferramenta, infra de IA, automações e sistemas |
| 04 | [04-3d-render.md](prompts/04-3d-render.md) | **3D Render / CGI** | Sólidos suaves, iluminação de estúdio (`24 fps`), volume tátil (*Nota:* usar WebGL/hero3d leve em 3,65 GB RAM; evitar Blender local pesado) | Hero shots curtos de produto/selos e intros de marca |
| 05 | [05-cel-boil.md](prompts/05-cel-boil.md) | **Cel Animation & Line Boil** | Traço orgânico "feito à mão" em `24 fps` / *on-twos* (`2–3` quadros em loop de tremor de linha) | Conteúdo autoral humanizado (*anti-IA genérica*) e storytelling |
| 06 | [06-collage.md](prompts/06-collage.md) | **Collage / Recortes & Textura** | Recortes em camadas com textura de papel, fita, sombras de recorte e movimento em *stop-motion* | Reels virais educativos, comparações Antes × Depois, documentário curto |
| 07 | [07-liquid.md](prompts/07-liquid.md) | **Liquid Motion** | Gotas, fusões orgânicas (*metaballs* / SVG `feColorMatrix` gooey), transições fluidas sem arestas duras | Transições de mundos cromáticos e conceitos de fluidez/velocidade |
| 08 | [08-morph.md](prompts/08-morph.md) | **Shape Morph** | Uma forma geométrica se metamorfoseia em outra continuamente guiando a atenção do olho sem corte seco | Histórias visuais de "um problema que vira solução" |
| 09 | [09-bauhaus.md](prompts/09-bauhaus.md) | **Geometric / Bauhaus** | Círculos, triângulos, quadrados, tipografia suíça rítmica presa estritamente ao BPM | Anúncios comerciais de alto impacto rítmico e manifesto visual |
| 10 | [10-synthwave.md](prompts/10-synthwave.md) | **Retro 80s Synthwave / VHS / Y2K** | Grade em perspectiva neon, scanlines, aberração cromática e tipografia retrô-futurista | Vídeos temáticos de cultura tech, comparações "passado × futuro" |
| 12 | [12-aurora-glass.md](prompts/12-aurora-glass.md) | **Aurora Gradient & Glassmorphism** | Gradientes difusos luminosos em movimento lento + camadas translúcidas vitrificadas de UI | Showcases refinados de app, interfaces limpas e anúncios SaaS |
| 18 | [18-hanazi.md](prompts/18-hanazi.md) | **Variety Show Kinetic Captions (`9:16`)** | Nativo vertical `1080×1920`, legendas cinéticas explosivas estilo programa/React + adesivos de reação | Cortes dinâmicos de Reels/Shorts falados com alta retenção |
| 19 | [19-paperclip.md](prompts/19-paperclip.md) | **Bold-Outline Sticker Explainer** | Estilo explicador estilo PaperClip: stickers com borda grossa contrastante, selos, contadores e infográficos | Tutoriais práticos, comparativos numéricos e Reels didáticos |
| 20 | [20-pixel.md](prompts/20-pixel.md) | **Pixel Art / 8-bit** | Sprites pixelados nítidos (`image-rendering: pixelated`), UI retrô de jogo e contadores arcade | Gamificação, IA para jogos/produtividade e ganchos nostálgicos |
| 22 | [22-hud.md](prompts/22-hud.md) | **Cyberpunk HUD / FUI** | Interfaces ficcionais táticas (miras, leituras telemétricas, grades, varreduras rápidas) | Ferramentas de código, segurança, agentes autônomos e radar tech |

---

## Regras de Uso na `motion-design-squad`

1. **Leia apenas o blueprint escolhido:** nunca carregue os `15` arquivos de uma vez no contexto. Escolha `1` estilo principal (ou no máximo `2` mundos contrastantes) e leia o arquivo correspondente em `prompts/*.md`.
2. **Adapte os parâmetros ao briefing:** os prompts originais são para filmes de `10s` em `16:9` (exceto `18-hanazi.md`, já nativo `9:16`). Ao aplicar para Instagram Reels / Shorts, converta o palco para **`1080×1920` (`9:16`)** e sincronize as durações com a narração (`gemini-voice` / `elevenlabs-voice`).
3. **Execução segura em hardware leve (`3,65 GB` RAM):**
   - Prefira implementar o estilo escolhido em **HyperFrames** (`SVG` + `CSS` + `GSAP`) sempre com `--workers 1 --quality looks`.
   - Evite shader heavy-blur ou múltiplas passagens full-screen em `12-aurora-glass` / `04-3d-render` no render local; prefira gradientes pré-suavizados e elementos focalizados em poucos nós DOM.
4. **Combine com `motionmaxxing` e `motion-reference-playbook.md`:** use `mg-styles-15` para a **estética visual**, e siga o `motionmaxxing` para **timing, câmera, cortes no movimento e controle anti-slop**.
