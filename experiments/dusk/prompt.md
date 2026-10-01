# プロンプト

Claude Code（Opus 5.5）に下のプロンプトを1回送りました。予定では、人が手を入れるのは Phase 1 の静止画への返信1回だけでした。実際には Phase 1 の途中でも手を入れています。

1. **Phase 1 の途中（v1 の制作中）**: 作業を止め、「すでに素晴らしいんだけど」と前置きしたうえで方向を変えた（下の「途中の指示」）。このときの v1 は5か所を巡り、太陽の円盤と雲があった
2. **Phase 1 の静止画への返信**: 「素敵、Phase 2 に進めて」

方向転換により、プロンプトのうち次の部分は使っていません。

- 5か所以上を巡る
- 黄金の時間と日没（太陽の円盤、グリーンフラッシュ）
- 雲、光の筋（薄明光線）

代わりに、1か所・1アングルで、日付と大気の違う6つの夕暮れを流しています。

## 要点

- 世界のどこかの夕暮れが、約30秒で流れる。黄金の時間 → 日没 → 残照 → ブルーアワー → 最初の星 → 夜
- 1周ごとに地球上の別の場所に移る（海・砂漠・高山・熱帯・高緯度・火山噴火のあと）。緯度と日付で太陽の沈む角度が変わる
- 大気は物理で光のふるまいを出し、そのあと自由に崩す。散乱は空気分子による Rayleigh、塵による Mie。吸収はオゾン。ほかに地球の影とビーナスベルト、雲が低いものから順に暗くなること、光の筋
- 見た目：リアルではなくアート。古いフィルムカメラのプリントのような、少しレトロな質感
  - 粒子は明るさに合わせて変わる（暗部で粗く、明部で細かい）
  - 黒は浮かせてマットに。色は少し褪せさせる
  - ハレーションを入れる。露出が開くほど粒子が大きくなる
- 参照先：川内倫子の淡いフィルム写真、杉本博司の海景、Rothko
- 失格：
  - 縞の出るグラデーション
  - インスタのフィルターのような橙と紫
  - 安っぽい古写真加工
  - フォトリアル
  - 白飛びした太陽
  - くっきりしたCGの雲
  - 真っ黒につぶれたブルーアワー
  - 濁ったグレー
- **途中で1回止まる**：主要な5つの瞬間の静止画を2か所ぶん出して止まり、人が見てから本番へ
- 操作・UIなし。画面の文字は隅の小さな撮影メモ（緯度・経度・日付）だけ。`#t=12.5` でその時刻に止まる
- 納品前に全場所を1秒ごとに書き出し、どのコマも壁に飾れることを確認する。グラデーションは 1:1 で縞を確認する。つなぎ目は見えないこと
- index.html 1枚

## 途中の指示（Phase 1 の途中、原文のまま）

```text
すでに素晴らしいんだけど
```

```text
もっとシンプルにして欲しい日の出と日の入りはいらないし、建物とかもいらない　１箇所からのアングルでいい　雲も多すぎるし　日の入りとか日の出は　いらないかも　淡いサンセット　のいろんな景色を　いろんなカラーを楽しみたい　海に反射する色も素敵だと思う　星空も幻想的で好き　日の入りと日の出の強烈な光と、雲はコントラスト強すぎるから除外したい　あと建造物もいらない
```

## Phase 1 への返信（原文のまま）

```text
素敵、Phase 2 に進めて
```

## 全文

```text
Create a single self-contained index.html: a slow, seamless, looping artwork in which one dusk somewhere on Earth passes in about 30 seconds — and then the next dusk begins somewhere else.

This is not a simulator, a website, or a UI. There are no controls. It is something to watch, like a photograph that breathes.

The work has two phases. In Phase 1 you build a first version, show me stills, and stop. Do not start Phase 2 until I reply.

Do not ask questions before Phase 1. Make every creative and technical decision yourself.

⸻

BEAUTY COMES FIRST

I do not want anything that is not beautiful. This is art, not a realistic rendering. Physics is only the starting point; art direction decides the final image. Every single frame should work as a print on a wall.

⸻

THE ARC OF ONE DUSK (about 30 seconds)

Choose the exact timing yourself, but pass through these moments:

1. Golden hour — low warm light, long soft gradients, the sky still bright.
2. Sunset — the disc touches the horizon, flattened and reddened by the atmosphere, its edge slightly darker than its centre. Very rarely, a green flash at the last instant.
3. Afterglow — the moment the sun is gone and the clouds light up from below, lowest clouds first turning grey, high cirrus staying pink and gold the longest.
4. Blue hour — the Earth's shadow rises in the east as a dark blue band with the pink Belt of Venus above it; the whole sky turns deep, luminous blue.
5. Night — the first star or planet appears, then more, by brightness.

Then the scene dissolves gently into the golden hour of the next place. The loop must have no visible seam.

⸻

PLACES

Each cycle is a different place on Earth, with its own latitude, date, horizon and air. For example:

* an open ocean horizon in the tropics, humid air
* a desert with fine dust in the air
* a high mountain ridge above a sea of clouds, very clean thin air
* a high-latitude coast in summer, where the sun slides along the horizon
* a city-free plain a few months after a large volcanic eruption, with violet twilight

Latitude and date must set the sun's path: near the equator it sinks steeply and fast; at high latitude it slants and lingers. Show this honestly.

Use at least five places and let them repeat in a fixed order.

⸻

THE ATMOSPHERE

Use physics so that the light behaves believably, then stylise it freely — simplify, soften, shift colours — until it reads as a picture rather than a simulation:

* Rayleigh scattering by air, Mie scattering by aerosols (with a forward-scattering glow around the sun), ozone absorption — the ozone is what keeps blue hour blue
* the sun's colour and brightness from its path length through the atmosphere
* the Earth's shadow and the Belt of Venus
* clouds lit by the sun from below after it has set, with the lit layer climbing from low clouds to high clouds as the sun sinks
* crepuscular rays where clouds or terrain block the sun
* aerosols and humidity that differ per place and visibly change the colours

Precomputed look-up tables (transmittance, sky-view) are welcome for performance.

⸻

THE LOOK

Artistic and a little retro, like a print from an old film camera — not photorealistic, not digital-clean.

* Visible film grain is part of the image. It follows luminance like real film (coarser in the shadows and mid-tones, finer in the highlights), changes every frame, and differs slightly per colour channel. Not a flat noise layer on top.
* Blacks are lifted into a soft matte; nothing is pure black or pure white.
* Colour is slightly faded and shifted, as in old colour negative film: warm, creamy highlights, and cool shadows that lean toward teal or green.
* Halation: a faint warm-red glow bleeds around the sun and the brightest parts of the sky.
* Soft, as if photographed with a lens that is slightly out of focus. Nothing is razor sharp. Depth is felt through haze.
* Long gradients carry the image; the grain hides any banding.
* Highlights roll off softly instead of clipping; the sun is a glowing disc, not a flat white blob.
* Exposure behaves like a patient photographer: as light fades, exposure opens slowly, so blue hour and night stay luminous and readable instead of turning black. As exposure opens, the grain grows, as it would on pushed film.
* A simple, calm composition with a low horizon and a lot of sky. Land or sea appears as soft silhouettes, reflections or glitter; no detailed objects. Simplify shapes into colour fields where it makes the picture stronger.

The level and mood to aim for: Rinko Kawauchi's pale, luminous film photographs, Hiroshi Sugimoto's Seascapes, Mark Rothko's colour fields.

Reject any result with:

* visible banding
* the orange-and-purple look of an Instagram filter
* cheap fake-vintage effects: scratches, dust, sepia, film borders, sprocket holes, light-leak presets, a heavy vignette
* photorealistic, digital-clean rendering
* lens-flare presets, neon, oversaturated colours
* a flat white sun
* sharp, CG-looking clouds
* a crushed, black blue hour
* muddy grey mixtures

⸻

TEXT ON SCREEN

The only text is a small, quiet caption in one corner, like a note on a photograph: the latitude, longitude and date of the current place. Nothing else — no title, UI, buttons, instructions, or debug overlays.

⸻

TECHNICAL REQUIREMENTS

* A single index.html using only HTML, CSS and JavaScript. WebGL2 is recommended.
* Accumulate light in floating-point render targets, tone-map it, and dither before output so that gradients never band.
* Everything is a function of time, so any moment can be reproduced. Support #t=12.5 in the URL to freeze at that time of the full loop.
* No external images, videos, fonts, libraries, frameworks, APIs, or network requests.
* Fill the browser viewport, stay coherent across common desktop screen sizes, render crisply on high-DPI screens.
* Run smoothly without excessive CPU or GPU usage. Start playing immediately when the file is opened.

⸻

PHASE 1 — FIRST VERSION, THEN STOP

1. Build a first working version.
2. For two contrasting places, render the five moments of THE ARC at 1600 px wide and save them as PNG files in ./stills/.
3. Look at every still honestly. Fix anything that is not beautiful before you show me.
4. Stop. Tell me where the stills are and wait for my reply.

⸻

PHASE 2 — FINISH

After my reply, finish all places.

Before delivering, render one frame per second of the entire loop for every place, look at all of them, and check 1:1 crops of the gradients for banding. Every frame must be beautiful. Check that the seam between places is invisible.

Start Phase 1 now.
```
