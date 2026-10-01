# プロンプト

Claude Code（Opus 5.5）に下のプロンプトを1回送りました。人が手を入れたのは、Phase 1 の静止画への返信1回だけです。

## 要点

- 夜の窓ガラスに雨が降り、その向こうの街の通りはすっかりピンぼけで、光が柔らかい色の円になっている。一晩（約3分）のあいだに明かりが1つずつ消え、最後は雨粒の中に朝の淡い青だけが残る
- UI・操作・音はなし。息をする写真のように眺めるもの
- 美しさが最優先。どのコマも壁に飾れるプリントであること
  - いくつもの尺度の細部：奥の大きな柔らかいボケ、レンズになって光を小さく逆さに映す雨粒、そのあいだの細かい霧の粒
  - 静かな余白と、動かない構図
  - ネオンは雨とフィルム越しに見た、褪せて暖かい色。電気的な色にしない
- 一晩の流れ：深夜 → 閉店（看板が1つずつ1〜2秒かけて消え、その色がすべての雨粒から同時に消える。作品の中心）→ 最後の数時間 → 夜明け前（空が淡い青に、ナトリウム灯が最後にゆっくり消える）→ 夜明け（人工の光はなく、窓が1つ暖かく灯るくらい）
- 雨は一晩じゅう静かに降り続く。粒ができ、育ち、合わさり、ときどき流れ落ちて、跡が小さな粒に割れる
- 4晩をつくり、決まった順で繰り返す。窓と通りは同じで、明かりの消える順と間合い、雨が晩ごとに違う。晩と晩のあいだにはっきりした切れ目を入れない（例：夜明けにガラスが曇り、晴れていくと次の夜）
- 光学：雨粒は逆さの小さな像を映すレンズで、縁が暗く、かすかに明るい縁取りがある。通りのボケは距離で大きさが変わり、縁は柔らかく、隅に向かってキャッツアイになり、色がわずかににじむ。流れた跡だけ曇りが晴れて、ゆっくり戻る。通りの光は曇りの中で柔らかく光る
- 見た目：古いフィルムカメラのプリントのような、少しレトロなアート
  - 粒子は明るさに合わせて変わり、コマごと・色ごとに違う
  - 黒は浮かせてマットに。ハイライトは暖かいクリーム色、影は青緑に寄せ、色を少し褪せさせる
  - ハレーションを入れる。明かりが消えるにつれて露出がゆっくり開き、粒子が大きくなる
  - ハイライトは切らずにやわらかく頭打ちにする
- 参照先：雨と曇りガラス越しの Saul Leiter のカラー写真、川内倫子、Gerhard Richter のぼかした絵画
- 失格：
  - 塊・にじみ・どろどろ（透明なレンズに見えない粒）
  - CG の水の質感、規則正しく並んだ円
  - 彩度の高いネオン、サイバーパンク、橙と青緑のグレーディング
  - 縁の硬いボケ、全部同じ大きさのボケ
  - ちらつき、火花など目立とうとする効果
  - 真っ黒につぶれた画面、濁ったグレー
  - 目に見える縞
  - 傷・ほこり・セピア・フィルム枠などの安っぽい古写真加工
- 画面の文字は隅の小さな時刻のメモだけ。`#t=12.5` でその時刻に止まる。index.html 1枚で、外部の画像・フォント・ライブラリ・通信は使わない
- **Phase 1**：雨粒とボケの描き方を3通り以上試して1枚のコンタクトシートで比べ、いちばん美しいものを選ぶ。最初の版をつくり、2晩ぶんの5つの瞬間（1600 px）と 1:1 の切り抜きを出して止まる
- **Phase 2**：4晩を仕上げ、ループ全体を1秒1コマで書き出して全部見る。グラデーションは 1:1 で縞を確認する。9割以上のコマが壁に飾れること、失格がひとつもないこと、晩のつなぎ目に切れ目がないこと

## Phase 1 への返信（原文のまま）

```text
素敵、Phase 2 に進めて
```

## 全文

```text
Create a single self-contained index.html: a slow, looping artwork. Rain on a pane of glass at night. Beyond the glass, a city street is completely out of focus, and its lights are soft discs of colour. Over one night, from the small hours until dawn, the lights go out one by one, until only the pale blue of morning is left in the raindrops.

This is not a simulator, a website, or a UI. There are no controls, no interaction, and no sound. It is something to watch, like a photograph that breathes.

The work has two phases. In Phase 1 you build a first version, show me stills, and stop. Do not start Phase 2 until I reply.

Do not ask questions before Phase 1. Make every creative and technical decision yourself.

⸻

BEAUTY COMES FIRST

I do not want anything that is not beautiful. Being new or clever only gets you in the door. This is art, not a realistic rendering. Physics is the starting point, and art direction decides the final image. Every single frame should work as a print on a wall.

Beauty here means:

* Detail at several scales at once: large, soft bokeh discs far behind; raindrops on the glass, each one a tiny lens holding a small, sharper, upside-down image of the lights; and a fine mist of micro-droplets between them.
* Quiet space. Parts of the glass carry only a few drops, and some of the frame is calm, dark colour.
* A clear composition that holds still. The camera never moves.
* Colour that is restrained, not loud. Neon here is seen through rain and film, so it is softened, faded and warm, never electric.

Any of these counts as a failure:

* blobs, smears, or mush: drops that do not read as clear glass lenses
* drops that look like a CG water material, or like a regular grid or pattern of circles
* oversaturated neon, cyberpunk or Blade Runner clichés, the orange-and-teal look of a film-grading preset
* bokeh discs with hard, digital edges, or all of one identical size
* flicker, sparks, or any other effect that draws attention to itself
* a crushed, black frame, or muddy grey mixtures
* visible banding

⸻

THE ARC OF ONE NIGHT (about 3 minutes)

Choose the exact timing yourself, but pass through these moments:

1. Deep night: the street is still awake. Shop neon, a convenience store, sodium streetlights, a few lit windows. The drops are full of colour, and every drop carries every light.
2. Closing time: the signs go out one at a time, at irregular intervals. A tube does not snap off; it fades over a second or two as it cools. Each time a light goes out, that colour disappears from every drop on the glass at once. This is the heart of the work. Let the viewer notice it.
3. The last hours: only a few lights remain, maybe just the convenience store and the streetlights. The frame is darker, calmer and bluer, and the bokeh that remains feels precious.
4. Before dawn: the sky beyond the street slowly turns from blue-black to a pale, cold blue. The streetlights go out last, with the slow warm fade of sodium lamps.
5. Dawn: no artificial light is left. The drops hold only the pale morning blue, and perhaps one window turning warm as someone wakes up.

The rain is steady and gentle all night. It may soften toward dawn, but it does not stop. Drops form, grow, and merge; now and then one grows heavy enough to slide down, leaving a trail that breaks into smaller beads. None of this is an event; it is just the glass, alive.

Then the next night begins. There must be no hard cut. One idea: at dawn the glass slowly mists over into soft, pale light, and the next night emerges as the mist clears. Find the most beautiful way.

Make four nights and let them repeat in a fixed order. They share the same window and the same street, but the order and timing in which the lights go out differ, and so does the rain. Every night is reproducible.

⸻

THE GLASS AND THE LIGHT

Use optics so the light behaves believably, then stylise freely until it reads as a picture rather than a simulation:

* Each drop acts as a small lens. It refracts the out-of-focus scene behind it, so it shows a smaller, inverted, sharper image of the lights, with a darker rim where it bends light away, and a faint bright edge.
* The focus is on the glass. The street is far out of focus: its lights become discs whose size depends on distance, with soft edges, a gentle cat's-eye shape toward the corners of the frame, and slight colour fringing.
* Sliding drops leave clear trails through the mist. Through a trail, the bokeh looks a little cleaner, then the mist slowly returns.
* Light from the street glows softly in the mist on the glass.

⸻

THE LOOK

Artistic and a little retro, like a print from an old film camera, not photorealistic and not digital-clean.

* Visible film grain is part of the image. It follows luminance like real film (coarser in the shadows and mid-tones, finer in the highlights), changes every frame, and differs slightly per colour channel. Not a flat noise layer on top.
* Blacks are lifted into a soft matte; nothing is pure black or pure white.
* Colour is slightly faded and shifted, as in old colour negative film: warm, creamy highlights, and cool shadows that lean toward teal or green.
* Halation: a faint warm-red glow bleeds around the brightest lights.
* Exposure behaves like a patient photographer: as the lights go out, exposure opens slowly, so the late frames stay luminous and readable instead of turning black. As exposure opens, the grain grows, as it would on pushed film.
* Long gradients carry the image; the grain hides any banding.
* Highlights roll off softly instead of clipping.

The level and mood to aim for: Saul Leiter's colour photographs through rain and steamed glass, Rinko Kawauchi's pale, luminous film photographs, Gerhard Richter's blurred paintings.

Also reject cheap fake-vintage effects: scratches, dust, sepia, film borders, sprocket holes, light-leak presets, a heavy vignette, lens-flare presets.

⸻

TEXT ON SCREEN

The only text is a small, quiet caption in one corner, like a note on a photograph: the time of night. Nothing else: no title, UI, buttons, instructions, or debug overlays.

⸻

TECHNICAL REQUIREMENTS

* A single index.html using only HTML, CSS and JavaScript. WebGL2 is recommended.
* Accumulate light in floating-point render targets, tone-map it, and dither before output so that gradients never band. Use soft limits instead of hard clamps wherever a value is limited.
* Everything is a function of time, so any moment can be reproduced. Support #t=12.5 in the URL to freeze at that time of the full loop.
* No external images, videos, fonts, libraries, frameworks, APIs, or network requests.
* Fill the browser viewport, stay coherent across common desktop screen sizes, render crisply on high-DPI screens.
* Run smoothly without excessive CPU or GPU usage. Start playing immediately when the file is opened.

⸻

PHASE 1 — FIRST VERSION, THEN STOP

1. Before settling on an approach, try at least three different ways of rendering the drops and the bokeh. Put them side by side on one contact sheet and choose the most beautiful. If none of them is beautiful, start again from a different idea instead of tuning constants.
2. Build a first working version with the chosen approach.
3. For two different nights, render the five moments of THE ARC at 1600 px wide, plus one 1:1 crop of drops for each night, and save them as PNG files in ./stills/.
4. Look at every still honestly. Fix anything that is not beautiful before you show me.
5. Stop. Tell me where the stills are and wait for my reply.

⸻

PHASE 2 — FINISH

After my reply, finish all four nights.

Before delivering, render one frame per second of the entire loop, look at all of them, and check 1:1 crops of the gradients for banding. At least 90% of the frames must be ones you would hang on a wall, and none may contain a failure from the list above. Check that the transition between nights has no visible cut.

Start Phase 1 now.

```
