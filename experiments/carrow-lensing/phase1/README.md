# Phase 1: five laws of light

Each sheet shows seeds 1–6 in their finished state. They were rendered at 1200×800 per frame as PNG in `./candidates/`, as the prompt asked; the copies here are JPEGs scaled to 1800 px wide to keep the repository small. The seeds are not curated. The prototypes (WebGL2 with float accumulation, a per-layer defocus gather, veiling glare, a hue-preserving tone map, grain and dither) are in `proto/`, and `proto/laws.js` holds the exact rule each law follows.

## 1. Maren Stratification — [strata.jpg](strata.jpg)

**Law:** Light rises or sinks to the height that belongs to its colour, then spreads sideways.

**Beauty:** Every lamp pours its light into silk-fine threads that settle into calm horizons, like Sugimoto seascapes drawn in light, with warm bands always above cool ones.

**Rule:** Each colour has a target height that varies linearly in mired, with warm light highest. Light approaches that height with critical damping from rest, drifts sideways at a constant speed, and fades as e^(−t/τ).

## 2. Hallam Tension — [drape.jpg](drape.jpg)

**Law:** Light only travels from one lamp to another, and hangs between them: warm light sags, cool light arches.

**Beauty:** A few lamps span the dark with soft leaf and eye shapes: amber hammocks below and pale arches above, joined at glowing points, with the rest of the frame left empty.

**Rule:** Each path is a catenary with a = H / w(T). The tension H is proportional to the span, and the weight w is proportional to (mired − neutral mired), so a negative weight turns the path into an arch. The light between two lamps is proportional to (P₁ × P₂) / distance.

## 3. Lindqvist Deflection — [bend.jpg](bend.jpg)

**Law:** Warm light turns to the right and cool light to the left, so every beam opens like a flower of arcs.

**Beauty:** Each beam unfurls into a dandelion of fine arcs that separate by warmth, amber curling one way and pale blue the other, and fade into wide dark circles.

**Rule:** Curvature k = k₀ (mired − neutral mired) / 100, which is constant along each ray.

## 4. Ferrand Braid — [braid.jpg](braid.jpg)

**Law:** A beam of light keeps untying and retying itself: its colours swing apart and meet again in white knots at a fixed rhythm.

**Beauty:** Each beam becomes a silk ribbon that blooms into amber and lilac lobes and pinches back to white, a slow luminous rhythm across the dark.

**Rule:** The sideways offset is d(s) = a · (mired − neutral) / span · sin(2πs/λ + φ). All colours cross at the same points, s = nλ/2, which gives the white knots.

## 5. Carrow Lensing — [caustic.jpg](caustic.jpg)

**Law:** Light bends toward warmer light, so every warm glow gathers the light passing it into a soft flame behind it.

**Beauty:** Pale shafts fall through the dark like window light in a Sugimoto theatre, and behind each faint warm sun they draw together into a single glowing flame.

**Rule:** Each warm glow raises the refractive index seen by other light: n = 1 + Σ aᵢ c(T) exp(−r²/2rᵢ²), where aᵢ sets the focal length. Rays follow d/ds(n t̂) = ∇n, and warmer passing light bends slightly more.

---

**Rejected on the way:**

| Law | What it did | Why I rejected it |
|---|---|---|
| Vey Curl | Clothoid spirals | Paisley blobs |
| Kessler Convergence | Beams pinch where they cross | Stage searchlights; the law was barely visible |
| Anselm Weight | Colour-dependent gravity | Firework fountains |
| Oriel Attraction | Rays fall toward lamps | Starbursts that read as lens flare |
| Sallow Orbit | Light circles the brightest lamp | Hard radial cut-offs and target rings |
| Pell Afterglow | Glow sinks by colour | Rigid lines and stage-curtain veils |

**Phase 1 time:** 2026-09-30, 21:54 to 22:31 JST (about 37 min, from receiving the prompt to reporting these sheets).
