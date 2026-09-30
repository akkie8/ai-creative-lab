# Carrow Lensing

**Light bends toward warmer light, so every warm glow gathers the light passing it into a soft flame behind it.**

## Definition

Wherever warm light is emitted, light cooler than it slows down. The refractive index seen by passing light is

  n(x) = 1 + κ · c(T) · W(x),  W(x) = Σᵢ Iᵢ bᵢ(t) exp(−|x − xᵢ|² / 2rᵢ²)

- **W** is the warm emission field. Glow *i* sits at xᵢ with radius rᵢ and peak emission Iᵢ, and it kindles over 30–46 s: bᵢ(t) = smoothstep((t − t₀ᵢ) / durᵢ).
- **κ** = 1/12.
- **c(T)** = 1 + 0.35 (m − m̄) / span. Here m is the passing light's colour temperature in mired, and m̄ is its shaft's mean. Warmer passing light bends a little more.
- **Rays** follow the eikonal equation d/ds (n t̂) = ∇n (RK2 on the GPU).
- **Focal length:** a glow emitting total energy e = 2πr²I acts as a Gaussian lens with focal length f = r / (√(2π) κ I). Each seed picks f and e, and r follows from them.
- **Scope:** every glow is warmer than every shaft. A glow acts only on light at its own depth, so shafts at other depths pass in front of it or behind it.
- **Rendering:** the light is carried as ray tubes (12 colour bands × 128 tubes per shaft) and deposited exactly into float buffers at four depths. Each depth is defocused by its distance from the focal plane (the two deepest also get a faint lens fringe), then given veiling glare, a hue-preserving tone map, film grain and dither.
- **Nothing else acts on the light.** Noise sets only the seed's layout and the faint streaks inside each shaft.

## Why it cannot exist

In our universe Maxwell's equations are linear in a vacuum: two beams pass through each other without either noticing the other. Refractive index belongs to matter, not to the colour of other light. Real light-by-light scattering is immeasurably weak at visible wavelengths, has no preference for warmth, and focuses nothing. Here, a light's colour temperature shapes the space other light travels through.

## What the light does, and why it looks this way

A pale shaft falls straight through the dark. As a warm glow kindles inside it, the shaft begins to lean toward the glow, and the light passing the glow is drawn in behind it.

A Gaussian index is a lens with severe spherical aberration. Rays near the glow's centre focus close behind it, and rays farther out focus later. Instead of a point they converge on a long, soft caustic, a cusp that brightens and then fans out again, like a candle flame drawn in light.

Warmer bands bend a little more and come to their focus first, so the colours separate slightly along each flame. The warm and cool fringe on the flames comes from the law itself, not from the lens. Shafts at different depths are defocused by different amounts, which gives the picture its depth. Because each glow brightens slowly, the flame grows over a minute; after 30 seconds you can see the light leaning toward warmth.

## Three seeds

- **[#seed=22](index.html#seed=22)**: Three warm glows inside an amber and ivory shaft pull its light into two flames that cross low in the frame, and the left two-thirds stays dark. The warmest and quietest seed.
- **[#seed=24](index.html#seed=24)**: Three glows kindle one after another where a wide pale shaft crosses a deeper, softer one, and they draw converging flames out of both. The fullest picture of the law.
- **[#seed=1](index.html#seed=1)**: Two embers close together pinch a lilac-grey diagonal into one clean focus, below which the light opens again into a soft fan. The law in its simplest form.
