# プロンプト

Claude Code（Opus 5.5）に、下のプロンプトを1回送っただけです。追加の指示はしていません。

## 要点

- 印刷の不具合（版ズレ・網点・オーバープリント・モアレ・トンボ）そのものを振り付けにする
- 紙・黒・蛍光の赤橙・コバルトの限られた色。ネオン、グロー、グラデーション、ありがちな「AIアート」は禁止
- 巨大なグロテスク体。文字を切り、伸ばし、版に分け、網点に溶かす
- どのコマで止めてもポスターとして成立すること
- 15〜20秒のシームレスなループ。静止 → 予兆 → 暴力的な動き → 衝撃 → 沈黙 → 変容 → 加速 → 解決
- MIS / REGIS / TERED で始まり、FORM が叩きつけられて壊れ、一瞬だけ完全に見当が合って PERFECT IS BORING. が現れ、小さな誤差から冒頭に戻る
- index.html 1枚。画像・動画・外部アセットなし。操作・UIなし。自動再生

## 全文

```text
Create a single self-contained index.html that is a breathtaking, seamless looping motion-graphics artwork running entirely in the browser.

This is not a website, not a landing page, not a UI, and not an interactive experience.

It is a piece of graphic design in motion.

CONCEPT — “MISREGISTERED”

Create an experimental motion piece inspired by the physical imperfections of print:

* risograph
* screen printing
* offset printing
* misregistration
* halftone screens
* overprinting
* ink trapping
* moiré
* registration marks
* crop marks
* editorial typography
* Swiss / International Typographic Style
* optical art
* experimental poster design
* kinetic typography

The central idea:

Printing errors become the choreography.

Everything should feel as though an impossibly sophisticated printing press has come alive and is continuously designing, printing, misaligning, destroying, and rebuilding the same poster.

It should feel tactile, graphic, physical, editorial, and extremely art-directed.

Avoid the generic “creative coding” aesthetic.

I want something that looks like it came from an elite motion-design studio.

⸻

VISUAL LANGUAGE

Use an intentionally limited print-inspired palette.

Think:

warm paper / off-white
deep ink black
fluorescent red-orange
rich cobalt / ultramarine blue

Additional colors may appear naturally where simulated inks overlap.

Do NOT use:

* neon-on-black cyberpunk aesthetics
* glowing particles
* generic gradients
* glassmorphism
* futuristic HUDs
* starfields
* random floating geometry
* generic generative-art blobs
* obvious “AI art” aesthetics

The frame should repeatedly become something that could work as a beautiful static poster if paused at almost any moment.

Composition matters enormously.

Use extreme scale.

Typography may extend beyond the viewport.

Let individual letters become architecture.

Use negative space aggressively.

Alternate between dense compositions and almost-empty frames.

⸻

TYPOGRAPHY

Typography is one of the main visual materials.

Use enormous, uncompromising grotesk typography.

Possible phrases include:

MISREGISTERED

FORM

OFFSET

PRINT

ERROR

001

CMYK

ALIGN

MISALIGN

PERFECT
IS
BORING.

Do not simply animate lines of text like presentation slides.

Letters should become graphical objects.

Crop them.

Stretch them.

Mask them.

Split them into printing plates.

Turn them into halftones.

Let them disappear into fields of dots.

Let individual glyphs become larger than the screen.

Use typography as mass, rhythm, texture, and geometry.

⸻

PRINT IMPERFECTIONS

Make the digital image feel physically printed.

Simulate details such as:

* independent ink plates
* subtle plate misalignment
* chromatic registration offsets
* imperfect ink coverage
* halftone dot structures
* changing halftone angles
* dot gain
* overprint behavior
* ink density variation
* paper grain
* rough printed edges
* registration targets
* crop marks
* printer annotations
* tiny technical numbers
* accidental-looking offsets
* moiré interference patterns

These should not merely be decorative overlays.

They should actively participate in the motion.

For example:

a letter separates into printing plates →

the plates drift out of registration →

their surfaces dissolve into halftone dots →

the dots enlarge until they become abstract circles →

the circles compress into lines →

the lines become a new typographic composition.

Everything should transform into something else.

Avoid arbitrary cuts whenever a visual transformation could connect two scenes.

⸻

MOTION

Create approximately a 15–20 second master loop.

The loop must be truly seamless.

The viewer should not be able to immediately identify where it restarts.

Think like a motion designer, not a frontend developer.

Build rhythm.

Use:

stillness
→ anticipation
→ violent graphic movement
→ impact
→ silence
→ transformation
→ acceleration
→ resolution.

Do not keep everything moving continuously.

Some of the strongest moments should almost stop.

Then suddenly break.

Movement should sometimes feel mechanical, like a printing press:

SNAP
SLIDE
REGISTER
STAMP
ROLL
CUT

Other moments should feel fluid and impossible.

Use strong easing and deliberate timing.

Avoid default CSS-animation feeling.

Avoid objects casually floating around.

Every movement should have visual intention.

⸻

SEQUENCE

Do not treat this as a rigid storyboard, but use this as a compositional direction.

Begin with an extremely strong poster-like frame dominated by:

MIS
REGIS
TERED

Hold it just long enough to register.

Then something becomes subtly wrong.

One printing plate shifts.

Then another.

Registration breaks apart.

The typography separates into multiple ink layers.

The composition violently expands.

Letters become halftone structures.

Halftones become enormous abstract fields.

Moiré patterns emerge from overlapping screens.

The camera/composition appears to travel through the printed structure.

Registration marks and printer metadata briefly become dominant graphical elements.

A massive typographic composition slams into place.

FORM

Then destroys itself.

A quieter composition appears.

Small technical typography.

Large negative space.

Then another burst.

At some point, create one unforgettable visual climax where several systems converge:

typography

* halftone
* misregistration
* geometric composition
* overprinting

For a brief moment, everything snaps into perfect registration.

Reveal:

PERFECT
IS
BORING.

Hold.

Then introduce one tiny registration error.

The error propagates through the entire composition.

The artwork reconstructs the opening frame.

The loop begins again without a visible cut.

⸻

GRAPHICAL DETAIL

I want obsessive detail.

Add tiny elements that reward looking closely:

printer calibration numbers
plate labels
coordinates
crop marks
registration crosses
micro typography
frame counters
ink percentages
random-looking production codes
measurement ticks

But maintain hierarchy.

This must never become visual clutter.

The large composition should read instantly from across the room.

The small details should reveal themselves only afterward.

⸻

TECHNICAL CONSTRAINTS

Deliver exactly one index.html.

It must run by simply opening it in a modern browser.

No images.

No videos.

No external visual assets.

No pre-rendered animation.

Generate the entire visual experience procedurally with browser technologies.

Canvas, WebGL2, shaders, CSS, SVG, or combinations of them are allowed.

Choose whatever rendering architecture produces the strongest result.

Prioritize:

* smooth 60fps motion
* crisp rendering on Retina displays
* responsive fullscreen composition
* correct resizing
* stable long-running animation
* deterministic looping
* high visual density without unnecessary performance waste

The piece should work especially well at 16:9 desktop dimensions.

No controls.

No buttons.

No cursor interactions.

No explanatory UI.

No loading screen unless technically unavoidable.

The artwork begins automatically.

⸻

QUALITY BAR

Do not make a demo.

Do not make a proof of concept.

Do not make a collection of effects.

Create a finished motion-design piece.

Every frame should feel art-directed.

Every transition should feel intentional.

There should be a clear visual system tying the entire animation together.

Be ruthless about removing anything that feels generic.

If an effect looks like something commonly seen in creative-coding demos, push it further until it feels designed rather than generated.

The final result should feel like:

a Swiss poster
fed into a broken industrial printing press
directed by an experimental motion-design studio
and somehow rendered live by the browser.

Make it strange.

Make it graphic.

Make it tactile.

Make it precise and imperfect at the same time.

Make something I would want to watch loop for five minutes.

Go all out.
```
