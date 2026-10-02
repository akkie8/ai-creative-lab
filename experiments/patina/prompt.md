# プロンプト

Claude Code（Opus 5.5）に下のプロンプトを1回送りました。人が手を入れたのは、Phase 1 の静止画への返信と、Phase 2 へ進める返信の2回だけです。

## 要点

- ページを開くたびに、まだ誰も見ていない古い金属の板の写真が1枚生まれる。正面から見た1枚の板で、まだらの緑青の上を、オレンジ・金・淡い水色の小さな錆の粒の帯が天の川のように横切り、まわりには静かな余白が広い
- 板は本物の写真のように。ただし仕上がりはカラーネガフィルムのプリント
- 絵は止まっていて、動くのはフィルムの粒子だけ。操作・音はなし。新しい絵は再読み込みで
- 参考画像を2枚添付（青緑の緑青、上下に向かって薄れる横の帯、広い余白。2枚目は下に向かって暗く沈む）。画像の中のタイルの継ぎ目は無視し、いつも継ぎ目のない1枚の板にする
- 美しさが最優先。どの種でも壁に飾れる1枚であること
  - 静けさ。画面の大部分は静かな緑青で、錆の粒は事件として、貴重に感じるくらい少なく
  - いくつもの尺度の細部。遠くからは1本の光の帯が通る色面（Rothko や杉本博司の海景）。近くでは緑青に殻・層・細かい粒があり、錆の粒はどれも、暗い芯、明るいオレンジか金の身、緑青ににじむ柔らかなしみを持つ
  - 呼吸する密度。帯の中で粒が集まり、まばらになり、帯から離れた迷い星もある
  - 抑えた色。緑は鉱物的で少し粉っぽく、彩度を上げない。暖かい色はオレンジと金だけ
- 失格：
  - Perlin やフラクタルのノイズの見た目、タイルの繰り返し
  - スプレーや点描ブラシ、紙吹雪、テラゾー、クリップアートの星空。丸く均一で、均等に散った粒。表面から育たずに貼り付けた粒
  - 塊・しみ・どろどろ・濁った茶色
  - ゲームのアセットやスマートマテリアルの見た目（プラスチックの光沢、均一な粗さ）
  - 彩度の高い緑やミントグリーン、彩度の高すぎるオレンジ
  - 真っ黒につぶれた画面、濁ったグレー
  - 目に見える縞
  - 傷・ほこり・セピア・フィルム枠・光漏れ・強いヴィネットなどの安っぽい古写真加工
- できかた：緑青は何十年もかけて層で育つ（下に暗い茶と銅色、上に青緑と灰緑の殻。水が溜まり流れたところはまだら、塩が集まったところは粉っぽく淡い）。オレンジの粒は鉄で、板に落ちた鉄の粒や鉄分を含む水がその場で錆びたもの。暗い黒茶の酸化の芯、オレンジと黄褐色の身、まわりの緑青に染みた薄い錆のしみを持つ。大きいものは厚く盛り上がり、小さいものはしみだけ。大きさは自然な分布（ごく小さいものがとても多く、中くらいは少なく、大きいものは数えるほど）。マスクで描かず、開いたときに数十年の天気を計算するような過程で育てる
- 種ごとに変えるもの：緑青の色（青緑、翡翠、灰緑、深い瓶の緑など）、明るさ（明るく淡い、片側へ暗く沈む、均一）、帯（位置・幅・わずかな傾きや曲がり・密度。ときに2本目の薄い帯、ときにまばらな散らばりだけ）、オレンジ・金・水色の割合、緑青の年齢と肌
- カメラと光：板に正対して画面を埋める。遠近・物・板の縁はなし。曇りの日のような柔らかい拡散光で、盛り上がった殻と錆の粒がかすかに光を受ける。古いレンズのようにわずかに柔らかいが、細かい肌は読める
- 見た目：粒子は明るさに合わせて変わり（影と中間で粗く、ハイライトで細かい）、コマごと・色ごとに違う。黒は浮かせてマットに、純黒も純白もなし。古いカラーネガのように少し褪せ、ハイライトはクリーム色、影は冷たく。ハイライトは切らずにやわらかく頭打ちに
- 参照先：2枚の参考画像、Kodak Portra で撮った古い青銅や銅の屋根、Mark Rothko の色面、杉本博司の Seascapes、川内倫子
- 計算のあいだは読み込みバーも文字も出さず、現像液の中でプリントが浮かぶように、柔らかい色 → 帯 → 細部の順に絵が現れる。途中のどの状態も美しく。計算は一般的なノート PC で20秒くらいまで
- 画面の文字は隅の小さな注記だけ（金属の種類、何年の天気を受けたか、種の番号）。`#seed=123` で同じ絵を出す。浮動小数のバッファに光をため、トーンマップしてディザをかける。index.html 1枚で、外部の画像・フォント・ライブラリ・通信は使わない。完成後は粒子だけが動き、CPU と GPU を軽く
- **Phase 1**：表面と錆の粒のつくり方を3通り以上試し、1600 px で1枚ずつ参考画像と並べてコンタクトシートで比べ、いちばん写真らしいものを選ぶ。最初の版をつくり、12の種を 1600 px で、うち3つは帯の 1:1 の切り抜きも出して止まる
- **Phase 2**：48の種を描いて全部見て、グラデーションを 1:1 で縞を確認する。42以上が壁に飾れること、失格がひとつもないこと、絵が現れていく途中が最初から最後まで美しいこと

## Phase 1 への返信（原文のまま）

```text
もっと大胆で生々しい錆にできる？
```

## 2回目の返信（原文のまま）

```text
Phase 2 に進んで
```

## 全文

参考画像（`.local/notes/rust-refs/`）は第三者の写真なので、このリポジトリには含めていません。

```text
Create a single self-contained index.html: every time the page is opened or reloaded, it generates one new, never-repeating picture of an old, oxidised metal surface. Seen straight on, one continuous plate fills the frame: a field of mottled green patina, crossed by a drifting band of tiny rust specks in orange, gold and pale aqua, like a Milky Way scattered across the metal, with wide, quiet space around it.

The material must look completely real, as if a real weathered plate had been photographed on colour negative film. The surface is photoreal; the print is film.

The image itself is still. Only the film grain is alive, shifting faintly every frame, so the picture breathes like a photograph. There are no controls, no interaction, and no sound. To see a new piece, you reload.

Two reference images are in .local/notes/rust-refs/. Look at them before you start. They show the feeling I want: a teal patina field, a horizontal band of specks whose density falls away above and below it, and a lot of calm space. In ref-2, the tone darkens toward the bottom, soft and grainy. Ignore the grid of tiles in them; this work is always one seamless plate.

The work has two phases. In Phase 1 you build a first version, show me stills, and stop. Do not start Phase 2 until I reply.

Do not ask questions before Phase 1. Make every creative and technical decision yourself.

⸻

BEAUTY COMES FIRST

I do not want anything that is not beautiful. Every seed should give a picture you would hang on a wall.

Beauty here means:

* Calm. Most of the frame is quiet patina; the specks are the event, and they are rare enough to feel precious.
* Detail at several scales at once. From far away, the picture is a colour field with one band of light running through it, like Rothko or a Sugimoto seascape. Up close, the patina has crusts, layers and fine granular texture, and every speck is an irregular little world: a dark core, a bright orange or gold body, and a soft stain bleeding into the green around it.
* A density that breathes. The specks cluster and thin out unevenly along the band, with a few strays far from it, the way stars do in the Milky Way.
* Restrained colour. The greens are mineral and slightly dusty, never saturated. Orange and gold are the only warm notes.

Any of these counts as a failure:

* the look of procedural noise: Perlin or fractal noise patterns, visible tiling or repetition
* the look of a spray-paint or speckle brush, confetti, terrazzo, or a clip-art star field: specks that are round, uniform, evenly spread, or pasted on top of the surface instead of grown from it
* blobs, stains, mush, or muddy brown
* the look of a game asset or a "smart material": plastic shine, uniform roughness
* saturated or minty green, or oversaturated orange
* a crushed, black frame or a muddy grey one
* visible banding

⸻

HOW THE SURFACE REALLY FORMS

Make it real by following how weathered metal actually ages, then direct each picture like a painter:

* Patina on copper and bronze grows in layers over decades. Darker brown and copper tones lie underneath, with blue-green and grey-green crusts on top. It is mottled where water lingered and ran, and chalky and pale where mineral salts collected.
* The orange specks are iron: grains of iron or splashes of iron-rich water that landed on the plate and rusted where they lay. Each one has a dark core of black-brown oxide, a body of orange and yellow-brown, and a thin halo of rust stain that has seeped into the patina around it. Bigger ones are crusty and raised; tiny ones are just a stain.
* The pale aqua and whitish spots are mineral deposits and patches of lighter, younger patina.
* Speck sizes follow a natural distribution: very many tiny ones, fewer middle-sized ones, and only a handful of large ones.

Grow the surface with a process, for example a simulation of decades of weather computed when the page opens, rather than painting it on with a mask.

⸻

WHAT VARIES FROM SEED TO SEED

Choose the range yourself, for example:

* the patina colour: teal, blue-green, jade, grey-green, a deeper bottle green
* the tone: some seeds bright and pale, some sinking darker toward one edge as in ref-2, some evenly lit
* the band: where it runs, how wide it is, a slight tilt or gentle curve, how dense it is; sometimes a second, fainter band, sometimes only a sparse scattering
* the balance of orange, gold and pale aqua specks
* the age and texture of the patina

Every seed must be beautiful. Variety is never an excuse for a weak picture.

⸻

THE CAMERA AND THE LIGHT

* Straight on, square to the plate, filling the frame. No perspective, no objects, no edges of the plate.
* Soft, even, diffuse light, like an overcast day, with only a gentle unevenness across the frame. The raised crusts and rust specks catch it faintly.
* The plate is very slightly soft, as if photographed with an old lens, but the fine texture still reads.

⸻

THE LOOK

The surface is photoreal. The image is a film print, a little retro, not digital-clean.

* Visible film grain is part of the image. It follows luminance like real film (coarser in the shadows and mid-tones, finer in the highlights), changes every frame, and differs slightly per colour channel. Not a flat noise layer on top.
* Blacks are lifted into a soft matte; nothing is pure black or pure white.
* Colour is slightly faded, as in old colour negative film: creamy highlights, and cool shadows.
* Highlights roll off softly instead of clipping.

The level and mood to aim for: the two reference images; old bronze and copper roofs photographed on Kodak Portra; Mark Rothko's colour fields; Hiroshi Sugimoto's Seascapes; Rinko Kawauchi's pale, luminous film photographs.

Also reject cheap fake-vintage effects: scratches or dust on the film, sepia, film borders, sprocket holes, light-leak presets, a heavy vignette.

⸻

WHILE IT IS BEING MADE

Because the image is still, you may spend real time on each one: a heavy growth simulation, high-resolution maps, many light samples. Up to about 20 seconds on a typical laptop is fine.

While it is computing, show no loading bar, spinner or text. Let the picture appear gradually, the way a print emerges in the developer: first soft colour, then the band, then detail. Every intermediate state must also be beautiful.

⸻

TEXT ON SCREEN

The only text is a small, quiet caption in one corner, like a note on a photograph: the kind of metal, how many years of weather it has seen, and the seed number. Nothing else: no title, UI, buttons, instructions, or debug overlays.

⸻

TECHNICAL REQUIREMENTS

* A single index.html using only HTML, CSS and JavaScript. WebGL2 is recommended.
* A random seed is chosen on every load. Support #seed=123 in the URL to reproduce a picture exactly.
* Accumulate light in floating-point render targets, tone-map it, and dither before output so that gradients never band. Use soft limits instead of hard clamps wherever a value is limited.
* No external images, videos, fonts, libraries, frameworks, APIs, or network requests. All textures are generated in code. The reference images are for you only; the page must not use them.
* Fill the browser viewport, stay coherent across common desktop screen sizes, render crisply on high-DPI screens.
* Once the picture is finished, only the grain moves; keep CPU and GPU use low.

⸻

PHASE 1 — FIRST VERSION, THEN STOP

1. Before settling on an approach, try at least three different ways of making the surface and the specks (for example: a growth simulation into height and material maps; deposition of particles that then corrode and stain; layered erosion with a reaction-diffusion stain). Render one seed of each at 1600 px wide, put them side by side on one contact sheet next to the reference images, and choose the one that looks most like a real photograph. If none of them looks real, start again from a different idea instead of tuning constants.
2. Build a first working version with the chosen approach.
3. Render 12 seeds at 1600 px wide, plus a 1:1 crop of the speck band from three of them, and save them as PNG files in ./stills/, with one contact sheet of all 12.
4. Look at every still honestly, as if you were comparing it with a real photograph of weathered metal. Fix anything that is not real or not beautiful before you show me.
5. Stop. Tell me where the stills are and wait for my reply.

⸻

PHASE 2 — FINISH

After my reply, finish the work.

Before delivering, render 48 seeds, look at every one, and check 1:1 crops of the gradients for banding. At least 42 of the 48 must be pictures you would hang on a wall, and none may contain a failure from the list above. Also check that the gradual appearance while computing is beautiful from start to finish.

Start Phase 1 now.
```
