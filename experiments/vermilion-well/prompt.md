# プロンプト

Claude Code（Opus 5.5）に、下のプロンプトを1回送っただけです。追加の指示はしていません。

## 元ネタ

kirill sh（@shneural）のポスト: https://x.com/shneural/status/2103151003272962130

Opus 5.5 と GPT 6 Astra に「履歴書に載せるショーリールのつもりで、15秒のモーショングラフィックスを全力で作って」と同じ依頼を出して比べたもの。

## アレンジした点

- ショーリールや技術デモにしない。ありがちなテックCM、SaaSの宣伝、ネオン系のAI映像、テンプレ的な幾何学アニメは禁止
- 「予想外」の大きな変化を3回以上入れる。ただしシーンを切り替えず、前の状態が変形・崩壊して次が生まれるようにする
- 15秒全体を、ひと続きの「生き物」のように見せる
- 最初のフレームと最後のフレームを同じ絵にする
- ブラウザで動く HTML / CSS / JS。外部の画像や動画は使わない。自動再生で、全画面でも崩れない

## 全文

```text
Create a 15-second motion graphics piece.
This is not just a showreel.
Imagine you are one of the best motion designers in the world, and you are given exactly 15 seconds of complete creative freedom.
What do you make?
That is the piece I want to see.
The theme, visual language, narrative, and medium are entirely up to you.
Do not make a generic tech commercial, SaaS promo, neon AI visual, or template-like geometric animation.
Make something that immediately demands attention.
The first second should make the viewer want to keep watching.
The piece should continuously evolve.
By the end, it should leave a strong visual afterimage.
Do not optimize for still-frame beauty alone.
The motion itself must be the design.
Use timing, acceleration, deceleration, pauses, reversals, transformation, fragmentation, merging, depth, scale, camera movement, and spatial composition intentionally.
Typography is allowed, but do not rely on text as the main visual idea.
Use any combination of techniques you think will create the strongest result, including:

* WebGL / Three.js
* Canvas
* CSS
* SVG
* shaders
* particles
* procedural animation
* generative art
* kinetic typography
* pseudo-3D
* 3D geometry
* post-processing
* distortion
* fluid motion
* morphing
* recursive structures
* optical illusions
* unconventional transitions

Do not turn this into a technical showcase.
Every technique should contribute to one coherent visual experience.
The most important requirement is unpredictability.
From the first frame, the viewer should not be able to predict what the piece will look like at 5 seconds, 10 seconds, or 15 seconds.
Include at least three major visual transformations that make the viewer think:
“I did not expect that.”
Do not simply cut between unrelated scenes.
Each transformation should emerge from the previous state through deformation, collapse, expansion, mutation, disassembly, or reconstruction.
Make the entire 15 seconds feel like one continuous visual organism.
Push the piece far enough that the viewer cannot immediately understand how it was made.
Do not imitate an existing artist or reference.
Use your own aesthetic judgment.
Do not play it safe.
Do not make it tasteful in a predictable way.
Do not converge toward familiar design trends.
This is a test of your visual taste, motion design ability, composition, rhythm, technical execution, and creative judgment.
Take risks.
Make something that feels authored.
Implementation requirements:

* It must run directly in a browser
* Use HTML / CSS / JavaScript
* You may use libraries such as Three.js if useful
* Do not depend on external image or video assets
* Generate as much of the visual material as possible through code
* The piece should autoplay
* It must function as a complete 15-second experience
* The loop should feel intentional rather than abrupt
* It should hold up at fullscreen size
* It should remain visually coherent across screen sizes

Do not explain the concept first.
Do not propose multiple ideas.
Do not give me a storyboard.
Make the creative decisions yourself and directly implement the finished piece.
One final constraint:
The first frame and the final frame should be visually identical.
Everything in between can become completely unrecognizable.
Make those 15 seconds feel much larger than 15 seconds.
Go all out.
```
