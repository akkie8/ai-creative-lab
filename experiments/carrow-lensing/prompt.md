# プロンプト

Claude Code（Opus 5.5）に下のプロンプトを1回送り、Phase 1 で出てきた5つの法則の中から1つ（caustic）を選んだだけです。人が手を入れたのはこの選択の1回だけで、ほかの指示はしていません（途中で「できたの？」と進み具合を一度聞いています）。

## 要点

- 絵は「光だけ」。ピントの合っていない、ぼやけた光とグラデーションで描く（見た目はプロンプト側で固定）
- 法則は、光のふるまいについて1つだけ発明させる（光がどう進み、曲がり、溜まり、混ざり、消えるか。ピントそのものの法則でもよい）
- 目指す水準：Wolfgang Tillmans の Freischwimmer、杉本博司のぼやけた建築・海景、Richter のぼかし絵画、Turrell、Rothko
- 失格：ネオン、レンズフレアのプリセット、虹色、くっきりした光の線、紙吹雪のような粒子、グラデーションの縞（バンディング）、濁ったグレー、「黒地にグロー」
- **2段階**：Phase 1 で法則の候補を5つ作り、各6シードのコンタクトシートを出して止まる。人が1つ選んでから Phase 2 で本番を作る
- 本番：シードごとに違う絵、同じシードからは同じ絵が育つ。約60秒で育ちきり、しばらく止まって次へ。隅に法則名とシードの小さなラベル
- 納品前に12シード以上描き、「壁に飾りたいか」で8つ以上が合格するまで続ける
- index.html 1枚＋法則の定義書 LAW.md

## 全文

```text
Create a generative artwork made only of light — soft, out-of-focus light and long, smooth gradients, as if photographed through a lens that is not quite in focus.

The light obeys one law of physics that does not exist in our universe. You invent that law.

The work has two phases. In Phase 1 you explore and then stop. Do not start Phase 2 until I have chosen.

Do not ask questions before Phase 1. Make every creative and technical decision yourself.

⸻

BEAUTY COMES FIRST

I do not want anything that is not beautiful. A new law that produces an ugly picture is a failure. Novelty is the entry ticket; beauty is the goal.

⸻

THE LOOK (fixed)

The medium is decided. The law must work inside it.

* Light, not objects: glows, halos, bokeh discs, soft beams, veils, light seeping through haze.
* Nothing is in sharp focus. Edges dissolve. Depth is expressed through defocus.
* Gradients carry the image: long, smooth, banding-free transitions of tone and colour.
* Photographic qualities: highlights roll off softly instead of clipping, a fine film grain, faint chromatic fringes in the bokeh.
* Large calm areas of near-darkness or pale haze, so the light has room to breathe.
* A restrained palette: two or three related hues and their mixtures. Colour comes from the temperature of the light and from what the law does to it.

The level and mood to aim for: Wolfgang Tillmans' Freischwimmer series, Hiroshi Sugimoto's out-of-focus architecture and seascapes, Gerhard Richter's blurred paintings, James Turrell, Mark Rothko. It must feel like a photograph of a real phenomenon, not a screensaver.

Reject any result with:

* neon colours, lens-flare presets, rainbow hues
* hard-edged glowing lines or sharp particles
* confetti-like dots scattered over the image
* visible banding in gradients
* muddy grey or dirty mixtures
* the look of “a glow effect on a black background”

⸻

THE LAW

Invent one rule for how light behaves that is not true in our world — how it travels, bends, pools, mixes, fades, remembers, or how focus itself works. It must be precise and internally consistent.

Give it:

* a name, as if it were a discovered effect or named after a fictional scientist
* a one-sentence statement that a non-scientist can understand
* a precise definition (quantities, equations or pseudocode) that the implementation follows exactly

The picture must come from the law acting on light. Do not paint a pleasant gradient and then justify it with the law.

A viewer who watches for about 30 seconds should begin to sense what the rule is.

Forbidden as the core mechanism — also when renamed or disguised:

* flow fields, Perlin / simplex / curl noise advection
* reaction-diffusion
* Voronoi, circle packing
* cellular automata
* strange attractors, fractals
* ordinary, physically correct optics (real refraction, real lens blur, real scattering) without any invented rule

Noise and randomness may be used only for initial conditions and small perturbations, never as the thing that makes the picture.

⸻

PHASE 1 — EXPLORE, THEN STOP

1. Invent five laws of light that are genuinely different from each other.
2. Prototype each one in the target medium and render a contact sheet per law: six different seeds in their finished state, each image at least 1200 px wide. Save them as PNG files in ./candidates/.
3. Look at every image honestly. Replace any law whose pictures are not beautiful before you show me anything. Do not show me anything you would not hang on a wall.
4. Write ./candidates/README.md: for each law, its name, the one-sentence statement, and one sentence on what makes its pictures beautiful.
5. Stop. Tell me where the contact sheets are and wait for me to choose one law.

⸻

PHASE 2 — BUILD THE CHOSEN LAW

Generative behaviour:

* Each run starts from a seed. The same seed must always grow the same final image, regardless of frame rate or screen size (fixed simulation timestep, seeded PRNG).
* Different seeds produce clearly different pictures that are still recognisably governed by the same law.
* Read the seed from the URL hash (#seed=123). If there is none, pick one at random and write it to the hash.
* The picture develops slowly from darkness or haze to its finished state over about 45–75 seconds, holds still for about 15 seconds, then dissolves gently into the next seed.
* Clicking anywhere or pressing Space moves to the next seed.

The only text on screen is a small, quiet label in one corner: the law's name and the seed number. No other UI, buttons, instructions, or debug overlays.

Technical requirements:

* A single index.html using only HTML, CSS and JavaScript. WebGL2 is recommended.
* Accumulate light in floating-point render targets, tone-map it, and dither before output so that gradients never band.
* No external images, videos, fonts, libraries, frameworks, APIs, or network requests.
* Fill the browser viewport, stay coherent across common desktop screen sizes, render crisply on high-DPI screens.
* Run smoothly without excessive CPU or GPU usage. Run immediately when the file is opened.

LAW.md, in plain language, at most one page:

* the name and the one-sentence statement
* the precise definition
* why it cannot exist in our universe
* what the light does under it, and why that looks the way it does
* three seeds you consider the best, and one sentence on each

Before delivering:

Render at least twelve seeds to the finished state at full resolution and look at 1:1 crops as well. Ask of every seed: would someone pay to hang this on a wall? If fewer than eight of twelve pass, keep working. Then watch the development of a few seeds from start to finish.

Start Phase 1 now.
```
