'use strict';
// World: x in [0, A], y in [0, 1] (y up). All lengths in units of frame height.
const mired = (T) => 1e6 / T;
const fromMired = (m) => 1e6 / m;
const LAYER_BLUR = [0.0045, 0.016, 0.04, 0.085];
const layersOf = () => [new Strokes(), new Strokes(), new Strokes(), new Strokes()];

// push one step of a light path; e = energy deposited during the step, col = colour
function deposit(S, x0, y0, x1, y1, sig, e, col) {
  const L = Math.hypot(x1 - x0, y1 - y0);
  if (L < 1e-7) S.push(x0, y0, x0, y0, sig, col[0] * e, col[1] * e, col[2] * e);
  else S.push(x0, y0, x1, y1, sig, col[0] * e / L, col[1] * e / L, col[2] * e / L);
}

// a restrained palette: two related colour temperatures + camera white balance and tint
function palette(R) {
  const modes = [
    { w: [1800, 2100], c: [2900, 3400], wb: [3000, 3500] },   // ember: amber and cream
    { w: [2400, 2900], c: [6000, 8000], wb: [4800, 5600] },   // dusk: apricot and lilac
    { w: [4200, 5200], c: [9000, 16000], wb: [5600, 6600] },  // moonlight: cream and blue-grey
    { w: [1900, 2300], c: [3600, 4400], wb: [3300, 3900] },   // candle: amber and cream
  ];
  const m = R.pick(modes);
  const warm = R.range(m.w[0], m.w[1]), cool = R.range(m.c[0], m.c[1]), wb = R.range(m.wb[0], m.wb[1]);
  const tint = [1, R.range(0.9, 0.985), R.range(0.97, 1.03)];
  const lk = kelvin(cool, wb);
  const lift = [0.006 * lk[0] + 0.002, 0.006 * lk[1] + 0.002, 0.006 * lk[2] + 0.004];
  return { warm, cool, wb, tint, lift };
}
function spread(R, n, A, minD, box) {   // positions with a minimum spacing (rejection sampling)
  const P = [];
  for (let tries = 0; P.length < n && tries < 2000; tries++) {
    const x = R.range(box[0], A - box[0]), y = R.range(box[1], box[2]);
    if (P.every((p) => Math.hypot(p[0] - x, p[1] - y) > minD)) P.push([x, y]);
  }
  return P;
}

// ---------------------------------------------------------------------------
// 1. STRATIFICATION — every colour of light has its own altitude.
//    A packet of temperature T relaxes (critically damped, from rest) to h(T), linear in mired, warm high:
//      y(t) = h + (y0 - h)(1 + kappa t) e^{-kappa t},  x(t) = x0 + u t,  u ~ U(-v0, v0),  brightness ~ e^{-t/tau}
LAWS.strata = {
  name: 'Maren Stratification',
  statement: 'Light rises or sinks to the height that belongs to its colour, then spreads sideways.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const yW = R.range(0.62, 0.84), yC = R.range(0.14, 0.34);
    const h = (T) => yC + (yW - yC) * (mired(T) - mired(cool)) / (mired(warm) - mired(cool));
    const lamps = spread(R, R.int(2, 3), A, 0.34, [0.15, 0.08, 0.92]);
    for (let [i, [x0, y0]] of lamps.entries()) {
      const T = fromMired(R.range(mired(cool), mired(warm)));
      if (Math.abs(y0 - h(T)) < 0.14) y0 = Math.min(0.94, Math.max(0.06, h(T) + (y0 > h(T) ? 0.16 : -0.16)));
      const P = R.range(0.35, 1), lay = i === 0 ? R.int(0, 1) : R.int(0, 2), K = Math.round(220 * P);
      const v0 = R.range(0.22, 0.5), kap = R.range(2.5, 5), tau = R.range(1.4, 2.6);
      for (let k = 0; k < K; k++) {
        const Tp = T * Math.exp(0.05 * R.gauss()), hp = h(Tp), col = kelvin(Tp, wb);
        const u = v0 * (R() < 0.5 ? -1 : 1) * (0.15 + 0.85 * R()), sig = 0.0022 + 0.002 * R();
        const sx = x0 + 0.004 * R.gauss(), sy = y0 + 0.004 * R.gauss();
        let px = sx, py = sy; const dt = 0.02;
        for (let t = dt; t < 4 * tau; t += dt) {
          const x = sx + u * t, y = hp + (sy - hp) * (1 + kap * t) * Math.exp(-kap * t);
          deposit(L[lay], px, py, x, y, sig, (P / K) * Math.exp(-t / tau) * dt, col);
          px = x; py = y;
          if (x < -0.3 || x > A + 0.3) break;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 2. CURL — light turns more the farther it has gone: curvature k(s) = s / a^2 (a clothoid), always to the left.
//    a = a0 * (T/T_lamp): cooler light is stiffer and curls wider. A ray comes to rest 1.2533 a from where it started.
LAWS.curl = {
  name: 'Vey Curl',
  statement: 'Light turns a little more with every step it travels, until it curls up and comes to rest.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const eyes = spread(R, R.int(1, 3), A, 0.4, [0.3, 0.25, 0.75]);
    for (const [ex, ey] of eyes) {
      const T = fromMired(R.range(mired(cool), mired(warm))), P = R.range(0.4, 1), lay = R.int(0, 3);
      const a0 = R.range(0.14, 0.3), psi = R() * 2 * Math.PI, om = R.range(0.12, 0.5), M = 280;
      const d = 1.2533 * a0, x0 = ex - d * Math.cos(psi + Math.PI / 4), y0 = ey - d * Math.sin(psi + Math.PI / 4);
      for (let m = 0; m < M; m++) {
        const Tr = T * Math.exp(0.1 * R.gauss()), a = a0 * (Tr / T), col = kelvin(Tr, wb);
        const ell = 3 * a, e0 = P / (M * ell), sig = 0.002 + 0.0015 * R();
        let th = psi + om * (2 * (m + R()) / M - 1), s = 0, x = x0, y = y0;
        while (s < 7 * a) {
          const ds = Math.min(0.004, 0.1 * a * a / Math.max(s, 1e-3)), dth = ((s + ds) * (s + ds) - s * s) / (2 * a * a);
          th += 0.5 * dth;
          const nx = x + Math.cos(th) * ds, ny = y + Math.sin(th) * ds;
          th += 0.5 * dth;
          deposit(L[lay], x, y, nx, ny, sig, e0 * Math.exp(-s / ell) * ds, col);
          x = nx; y = ny; s += ds;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 3. CONVERGENCE — a beam's width depends on the other light it is passing through:
//    w_i(s) = w_min + (w0_i(s) - w_min) exp(-beta * sum_{j!=i} L_j(x_i(s)))   (energy per length conserved)
LAWS.knot = {
  name: 'Kessler Convergence',
  statement: 'Light is blurred wherever it is alone; where it passes through other light it gathers into a finer, brighter thread.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const m = R.int(3, 5), NS = 600, beta = R.range(0.12, 0.2), wmin = 0.009;
    const main = Math.PI / 2 + R.range(-0.35, 0.35), beams = [];
    for (let i = 0; i < m; i++) {
      const ex = R.range(0.05, A - 0.05), ey = R.range(-0.08, 0.12);
      const ang = main + R.range(-0.42, 0.42), dx = Math.cos(ang), dy = Math.sin(ang);
      const T = fromMired(R.range(mired(cool), mired(warm)));
      const b = { ex, ey, dx, dy, len: 1.6, P: R.range(0.5, 1), col: kelvin(T, wb), w0: new Float32Array(NS), w: new Float32Array(NS) };
      const wa = R.range(0.004, 0.01), div = R.range(0.03, 0.07);
      for (let k = 0; k < NS; k++) { b.w0[k] = wa + div * (k / NS) * b.len; b.w[k] = b.w0[k]; }
      beams.push(b);
    }
    const pos = (b, k) => [b.ex + b.dx * b.len * k / (NS - 1), b.ey + b.dy * b.len * k / (NS - 1)];
    const lum = (b, x, y) => {
      const rx = x - b.ex, ry = y - b.ey; const s = rx * b.dx + ry * b.dy, d = rx * -b.dy + ry * b.dx;
      if (s < 0) return 0;
      const k = Math.max(0, Math.min(NS - 1, s / b.len * (NS - 1))), w = b.w[Math.round(k)];
      return b.P / (2.5066 * w) * Math.exp(-d * d / (2 * w * w));
    };
    for (let it = 0; it < 16; it++) {
      for (const b of beams) {
        const tgt = new Float32Array(NS);
        for (let k = 0; k < NS; k++) {
          const [x, y] = pos(b, k); let Lam = 0;
          for (const o of beams) if (o !== b) Lam += lum(o, x, y);
          tgt[k] = Math.min(b.w0[k], wmin + (b.w0[k] - wmin) * Math.exp(-beta * Lam));
        }
        for (let k = 0; k < NS; k++) b.w[k] = 0.6 * b.w[k] + 0.4 * tgt[k];
      }
    }
    for (const b of beams) {
      for (let k = 0; k + 1 < NS; k++) {
        const [x0, y0] = pos(b, k), [x1, y1] = pos(b, k + 1);
        const s = 0.5 * (b.w[k] + b.w[k + 1]), f = Math.exp(-0.6 * k / NS);
        L[0].push(x0, y0, x1, y1, s, b.col[0] * b.P * f, b.col[1] * b.P * f, b.col[2] * b.P * f);
      }
    }
    const yc = R.range(0.3, 0.7);
    return { layers: L, look: { blur: [[0.006, 0.004, 0.05, yc], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], glare: [0.14, 0.1], autoExpo: [0.998, 1.8], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 4. WEIGHT — light has weight proportional to how much warmer it is than T_n:
//    g(T) = g0 * (mired(T) - mired(T_n)) / 100 ; rays are parabolas x = x0 + c cos(phi) t, y = y0 + c sin(phi) t - g t^2/2
LAWS.heavy = {
  name: 'Anselm Weight',
  statement: 'Warm light is heavy and falls, cool light is lighter than air and rises; every ray flies in an arc.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const Tn = fromMired(0.5 * (mired(warm) + mired(cool))), g0 = R.range(0.35, 0.7);
    const lamps = spread(R, R.int(1, 3), A, 0.35, [0.3, 0.12, 0.55]);
    for (const [x0, y0] of lamps) {
      const T = fromMired(mired(Tn) + R.range(-40, 60)), P = R.range(0.4, 1), lay = R.int(0, 3);
      const c = R.range(0.55, 0.8), tau = R.range(1.0, 1.6), M = 420;
      const psi = Math.PI / 2 + R.range(-0.35, 0.35), om = R.range(0.25, 0.8);
      for (let m = 0; m < M; m++) {
        const Tr = fromMired(mired(T) + 70 * R.gauss()), col = kelvin(Tr, wb), g = g0 * (mired(Tr) - mired(Tn)) / 100;
        const ph = psi + om * (2 * (m + R()) / M - 1), vx = c * Math.cos(ph), vy = c * Math.sin(ph), sig = 0.002 + 0.0015 * R();
        let px = x0, py = y0; const dt = 0.012;
        for (let t = dt; t < 4 * tau; t += dt) {
          const x = x0 + vx * t, y = y0 + vy * t - 0.5 * g * t * t;
          deposit(L[lay], px, py, x, y, sig, (P / M) * Math.exp(-t / tau) * dt, col);
          px = x; py = y;
          if (y < -0.3 || y > 1.3) break;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// depth-interpolated deposit: z in [0,3] (layer index, fractional) splits energy between neighbouring blur layers
function depositZ(L, z, x0, y0, x1, y1, sig, e, col) {
  const i = Math.max(0, Math.min(2, Math.floor(z))), f = Math.max(0, Math.min(1, z - i));
  if (f < 1) deposit(L[i], x0, y0, x1, y1, sig, e * (1 - f), col);
  if (f > 0) deposit(L[i + 1], x0, y0, x1, y1, sig, e * f, col);
}

// catenary through (x1,y1),(x2,y2) with parameter a (a<0 = arch upward); returns y(x)
function catenary(x1, y1, x2, y2, a) {
  const s = Math.sign(a) || 1, A = Math.abs(a);
  if (A > 200) return (x) => y1 + (y2 - y1) * (x - x1) / (x2 - x1);
  // solve s*A*(cosh((x2-x0)/A) - cosh((x1-x0)/A)) = y2 - y1 for x0 (monotonic in x0)
  const f = (x0) => s * A * (Math.cosh((x2 - x0) / A) - Math.cosh((x1 - x0) / A)) - (y2 - y1);
  let lo = x1 - 40 * A, hi = x2 + 40 * A;
  const flo = f(lo);
  for (let i = 0; i < 100; i++) { const m = 0.5 * (lo + hi); if (Math.sign(f(m)) === Math.sign(flo)) lo = m; else hi = m; }
  const x0 = 0.5 * (lo + hi), c = y1 - s * A * Math.cosh((x1 - x0) / A);
  return (x) => s * A * Math.cosh((x - x0) / A) + c;
}

// ---------------------------------------------------------------------------
// 5. TENSION — light cannot shine into empty space: it only travels from a lamp to another lamp,
//    hanging between them under a fixed tension H with weight per length w(T) = w0 (mired(T) - mired(Tn)) / 100.
//    The path is the catenary with parameter a = H / w(T): warm light sags, cool light arches, neutral light is straight.
LAWS.drape = {
  name: 'Hallam Tension',
  statement: 'Light only travels from one lamp to another, and hangs between them: warm light sags, cool light arches.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const Tn = fromMired(0.5 * (mired(warm) + mired(cool))), span = mired(warm) - mired(cool);
    const lamps = spread(R, R.int(3, 4), A, 0.35, [0.14, 0.34, 0.66]).map(([x, y], i) => ({
      x, y, z: i === 0 ? R.range(0, 0.8) : R.range(0, 2.2), P: R.range(0.4, 1), m: R.range(mired(cool), mired(warm)),
    }));
    const h = R.range(0.5, 0.85);                             // tension per unit span
    for (let i = 0; i < lamps.length; i++) for (let j = i + 1; j < lamps.length; j++) {
      let a = lamps[i], b = lamps[j];
      if (a.x > b.x) [a, b] = [b, a];
      if (b.x - a.x < 0.25 || Math.abs(b.y - a.y) > 0.8 * (b.x - a.x)) continue;
      const d = Math.hypot(b.x - a.x, b.y - a.y), flux = a.P * b.P / d, N = Math.round(90 * flux), H = h * d;
      for (let k = 0; k < N; k++) {
        const m0 = Math.min(mired(warm), Math.max(mired(cool), (R() < 0.5 ? a.m : b.m) + 0.12 * span * R.gauss()));
        const T = fromMired(m0), col = kelvin(T, wb);
        const w = (m0 - mired(Tn)) / span * 2;               // -1..1
        const ac = Math.abs(w) < 1e-3 ? 1e4 : H / w;
        const y = catenary(a.x, a.y, b.x, b.y, ac), S = 140, sig = 0.002 + 0.0015 * R();
        let px = a.x, py = a.y, len = 0; const pts = [];
        for (let s = 1; s <= S; s++) { const x = a.x + (b.x - a.x) * s / S; pts.push([x, y(x)]); }
        for (const [x, yy] of pts) len += Math.hypot(x - px, yy - py), px = x, py = yy;
        px = a.x; py = a.y;
        const e = flux / N * 0.6;
        for (let s = 0; s < S; s++) {
          const [x, yy] = pts[s], seg = Math.hypot(x - px, yy - py);
          depositZ(L, a.z + (b.z - a.z) * (s + 0.5) / S, px, py, x, yy, sig, e * seg, col);
          px = x; py = yy;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 6. LENSING — every lamp pulls the light of the other lamps toward itself, with strength proportional to its power:
//    d2x/dt2 = sum_j G P_j (r_j - x) / (|r_j - x|^2 + eps^2)^{3/2}
LAWS.lens = {
  name: 'Oriel Attraction',
  statement: 'Every light pulls on the light of other lamps, so light swings around lamps like comets around a sun.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const lamps = spread(R, R.int(2, 4), A, 0.35, [0.25, 0.2, 0.8]).map(([x, y]) => ({ x, y, P: R.range(0.3, 1), lay: R.int(0, 3), T: fromMired(R.range(mired(cool), mired(warm))) }));
    const G = R.range(0.02, 0.05), eps = 0.02;
    for (const lp of lamps) {
      const M = 360, tau = R.range(1.2, 2.2), c = 0.5;
      for (let m = 0; m < M; m++) {
        const Tr = lp.T * Math.exp(0.06 * R.gauss()), col = kelvin(Tr, wb), sig = 0.002 + 0.0015 * R();
        const ph = 2 * Math.PI * (m + R()) / M;
        let x = lp.x + 0.01 * Math.cos(ph), y = lp.y + 0.01 * Math.sin(ph), vx = c * Math.cos(ph), vy = c * Math.sin(ph);
        const dt = 0.004;
        for (let t = 0; t < 4 * tau; t += dt) {
          let ax = 0, ay = 0;
          for (const o of lamps) if (o !== lp) { const dx = o.x - x, dy = o.y - y, r2 = dx * dx + dy * dy + eps * eps, f = G * o.P / (r2 * Math.sqrt(r2)); ax += f * dx; ay += f * dy; }
          const nvx = vx + ax * dt, nvy = vy + ay * dt, nx = x + nvx * dt, ny = y + nvy * dt;
          deposit(L[lp.lay], x, y, nx, ny, sig, (lp.P / M) * Math.exp(-t / tau) * dt, col);
          x = nx; y = ny; vx = nvx; vy = nvy;
          if (x < -0.4 || x > A + 0.4 || y < -0.4 || y > 1.4) break;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 7. CHROMATIC CURVATURE — a ray's curvature is proportional to how warm it is:
//    k(T) = k0 * (mired(T) - mired(Tn)) / 100 ; warm light turns right, cool light turns left, neutral light goes straight.
LAWS.bend = {
  name: 'Lindqvist Deflection',
  statement: 'Warm light turns to the right and cool light to the left, so every beam opens like a flower of arcs.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const Tn = fromMired(0.5 * (mired(warm) + mired(cool))), span = mired(warm) - mired(cool);
    const lamps = spread(R, R.int(1, 3), A, 0.4, [0.38, 0.15, 0.6]);
    for (const [i, [x0, y0]] of lamps.entries()) {
      const P = R.range(0.4, 1), lay = i === 0 ? R.int(0, 1) : R.int(0, 3), k0 = R.range(2.5, 5) / span * 100;
      const psi = Math.PI / 2 + R.range(-0.5, 0.5), om = R.range(0.03, 0.2), M = 360, ell = R.range(0.6, 1.1);
      const mc = mired(Tn) + R.range(-0.15, 0.15) * span;
      for (let m = 0; m < M; m++) {
        const mr = mc + 0.28 * span * R.gauss(), col = kelvin(fromMired(mr), wb), k = k0 * (mr - mired(Tn)) / 100;
        let th = psi + om * (2 * R() - 1), x = x0, y = y0; const ds = 0.004, sig = 0.002 + 0.0015 * R();
        for (let s = 0; s < 3.5 * ell; s += ds) {
          th -= 0.5 * k * ds; const nx = x + Math.cos(th) * ds, ny = y + Math.sin(th) * ds; th -= 0.5 * k * ds;
          deposit(L[lay], x, y, nx, ny, sig, (P / M) * Math.exp(-s / ell) * ds / ell, col);
          x = nx; y = ny;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 8. ORBIT — light cannot leave the brightest lamp: every packet circles it at the distance where it was born,
//    warm light clockwise, cool light counter-clockwise; radius shifts slightly with colour r = r0 (1 + 0.0008 (m - m_lamp)).
LAWS.orbit = {
  name: 'Sallow Orbit',
  statement: 'All light circles the brightest lamp at the distance where it was born, warm light one way and cool light the other.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const mn = 0.5 * (mired(warm) + mired(cool)), span = mired(warm) - mired(cool);
    const sx = R.range(-0.3, A + 0.3), sy = R.range(-0.6, 0.4);   // the sun: often below / outside the frame
    L[1].push(sx, sy, sx, sy, 0.01, 0.6, 0.55, 0.5);
    const lamps = spread(R, R.int(3, 7), A, 0.12, [0.1, 0.1, 0.9]);
    for (const [x0, y0] of lamps) {
      const P = R.range(0.3, 1), z = R.range(0, 3), m0 = R.range(mired(cool), mired(warm));
      const r0 = Math.hypot(x0 - sx, y0 - sy), a0 = Math.atan2(y0 - sy, x0 - sx), M = 160, ell = R.range(0.5, 1.4);
      for (let k = 0; k < M; k++) {
        const mr = m0 + 0.18 * span * R.gauss(), col = kelvin(fromMired(mr), wb), dir = mr > mn ? -1 : 1;
        const r = r0 * (1 + 0.25 * (mr - m0) / span), sig = 0.002 + 0.0015 * R();
        let px = sx + r * Math.cos(a0), py = sy + r * Math.sin(a0); const ds = 0.004;
        for (let s = ds; s < 3.5 * ell; s += ds) {
          const a = a0 + dir * s / r, x = sx + r * Math.cos(a), y = sy + r * Math.sin(a);
          depositZ(L, z, px, py, x, y, sig, (P / M) * Math.exp(-s / ell) * ds / ell, col);
          px = x; py = y;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 9. BRAID — a beam's colours swing apart and back together in one shared rhythm.
//    A ray of mired m, at distance s along its beam, is displaced sideways by
//      d(s) = a (m - m_n) / span * sin(2 pi s / lambda)
//    so all colours cross again at s = n lambda / 2 (white knots) and part between them, swapping sides each time.
LAWS.braid = {
  name: 'Ferrand Braid',
  statement: 'A beam of light keeps untying and retying itself: its colours swing apart and meet again in white knots at a fixed rhythm.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const mn = 0.5 * (mired(warm) + mired(cool)), span = mired(warm) - mired(cool);
    const nb = R() < 0.55 ? 1 : 2; let th0 = 0;
    for (let b = 0; b < nb; b++) {
      let th = R.range(-0.45, 0.45); if (b === 1) th = th0 + (R() < 0.5 ? -1 : 1) * R.range(0.3, 0.5); else th0 = th;
      const ux = Math.cos(th), uy = Math.sin(th), cy = R.range(0.3, 0.7), cx = A * R.range(0.3, 0.7);
      const x0 = cx - ux * 1.6, y0 = cy - uy * 1.6;          // beams enter from outside the frame
      const lam = R.range(0.55, 1.1), amp = R.range(0.12, 0.26), z = b === 0 ? R.range(0, 0.6) : R.range(2, 3);
      const P = (b === 1 ? 0.45 : 1) * R.range(0.5, 1), ell = R.range(2.5, 5), M = 320, mc = mn + R.range(-0.12, 0.12) * span;
      const ph = R() * Math.PI * 2;
      for (let k = 0; k < M; k++) {
        const mr = mc + 0.32 * span * R.gauss(), col = kelvin(fromMired(mr), wb), c = (mr - mn) / span;
        const off = 0.007 * R.gauss(), sig = 0.0018 + 0.0015 * R(), ds = 0.005;
        const at = (s) => { const d = off + amp * c * Math.sin(2 * Math.PI * s / lam + ph); return [x0 + ux * s - uy * d, y0 + uy * s + ux * d]; };
        let [px, py] = at(0);
        for (let s = ds; s < 3.2; s += ds) {
          const [x, y] = at(s);
          depositZ(L, z, px, py, x, y, sig, (P / M) * Math.exp(-s / ell) * ds, col);
          px = x; py = y;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};

// ---------------------------------------------------------------------------
// 10. AFTERGLOW — light sheds a glow wherever it passes; the glow sinks straight down at a speed set by its colour
//     (v = v0 (m - m_c + 0.15 span) / span: warm sinks fast, cool barely sinks) and fades as e^{-t/tau}.
//     The beam itself loses what it sheds: I(s) = I0 e^{-s/ell}.
LAWS.virga = {
  name: 'Pell Afterglow',
  statement: 'Light leaves a glow wherever it passes, and the glow sinks — warm light falls far, cool light hardly at all.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const mc = mired(cool), span = mired(warm) - mc;
    const lamps = spread(R, R.int(1, 3), A, 0.35, [0.15, 0.45, 0.88]), fall = R.range(0.12, 0.3);
    for (const [b, [x0, y0]] of lamps.entries()) {
      const th = R.range(-0.4, 0.4) + (R() < 0.5 ? 0 : Math.PI), ux = Math.cos(th), uy = Math.sin(th);
      const z = b === 0 ? R.range(0.3, 1.2) : R.range(0.8, 3), P = R.range(0.5, 1) * (b === 0 ? 1 : 0.7), ell = R.range(0.45, 1.1);
      const mb = mc + R.range(0.25, 0.75) * span, ds = 0.004, NC = 9;
      // smooth perturbation of the shed glow along the beam (knots every 0.035, cosine-interpolated)
      const kn = Array.from({ length: 200 }, () => Math.exp(0.35 * R.gauss()));
      const mod = (s) => { const u = s / 0.035, i = Math.floor(u), f = (1 - Math.cos(Math.PI * (u - i))) / 2; return kn[i] * (1 - f) + kn[i + 1] * f; };
      L[Math.min(3, Math.round(z))].push(x0, y0, x0, y0, 0.006, ...kelvin(fromMired(mb), wb).map((c) => c * 0.02 * P));
      for (let s = 0; s < 5 * ell; s += ds) {
        const x = x0 + ux * s, y = y0 + uy * s;
        if (x < -0.4 || x > A + 0.4) break;
        const I = P * Math.exp(-s / ell) * mod(s) * ds / ell;
        depositZ(L, z, x, y, x + ux * ds, y + uy * ds, 0.003, 0.08 * I, kelvin(fromMired(mb), wb));
        for (let c = 0; c < NC; c++) {
          const mr = mb + 0.3 * span * R.gauss(), col = kelvin(fromMired(mr), wb);
          const Lf = fall * Math.max(0.04, (mr - mc + 0.1 * span) / (1.1 * span));  // fall length v*tau
          const gx = x + 0.003 * R.gauss(), sig = 0.003 + 0.002 * R(), n = 14, dl = 3.5 * Lf / n;
          for (let i = 0; i < n; i++) {
            const e = (I / NC) * (Math.exp(-i * dl / Lf) - Math.exp(-(i + 1) * dl / Lf));
            depositZ(L, z, gx, y - i * dl, gx, y - (i + 1) * dl, sig, e, col);
          }
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};


// ---------------------------------------------------------------------------
// 11. LIGHT REFRACTS LIGHT — warm light is a slower medium for cooler light.
//     A warm glow of radius r and strength a raises the index seen by passing light: n(p) = 1 + sum a_i c(T) exp(-|p-c_i|^2 / 2 r_i^2),
//     c(T) = 1 + 0.35 (m - m_ref)/span (warmer passing light bends a little more). Rays obey d/ds(n t) = grad n.
LAWS.caustic = {
  name: 'Carrow Lensing',
  statement: 'Light bends toward warmer light, so every warm glow gathers the light passing it into a soft flame behind it.',
  build(seed, A) {
    const R = rng(seed), L = layersOf(), pal = palette(R), { warm, cool, wb } = pal;
    const span = mired(warm) - mired(cool);
    const shafts = R() < 0.6 ? 1 : 2;
    for (let sh = 0; sh < shafts; sh++) {
      const phi = -Math.PI / 2 + R.range(-0.5, 0.5), dx = Math.cos(phi), dy = Math.sin(phi);   // travelling downward
      const z = sh === 0 ? R.range(0.2, 1.2) : R.range(2, 3), Psh = sh === 0 ? 1 : 0.5;
      const cx = A * R.range(0.3, 0.7), wsh = R.range(0.1, 0.22);
      const mref = mired(cool) + R.range(0, 0.3) * span;
      // warm glows inside the shaft
      const orbs = [];
      for (let k = 0, n = R.int(1, 3); k < n; k++) {
        const t = R.range(0.25, 0.6), off = R.range(-0.8, 0.8) * wsh;
        const ox = cx + dx * (t - 0.5) * 1.4 - dy * off, oy = 0.5 + dy * (t - 0.5) * 1.4 + dx * off;
        const r = R.range(0.045, 0.1), f = R.range(0.25, 0.5), a = r / (f * Math.sqrt(2 * Math.PI));
        const T = fromMired(mired(warm) - R.range(0, 0.25) * span);
        orbs.push({ x: ox, y: oy, r, a, T });
        depositZ(L, z, ox, oy, ox, oy, r * 0.8, Psh * R.range(0.012, 0.025), kelvin(T, wb));
      }
      const grad = (x, y) => {
        let n = 1, gx = 0, gy = 0;
        for (const o of orbs) { const ex = x - o.x, ey = y - o.y, g = o.a * Math.exp(-(ex * ex + ey * ey) / (2 * o.r * o.r)); n += g; gx -= g * ex / (o.r * o.r); gy -= g * ey / (o.r * o.r); }
        return [n, gx, gy];
      };
      const M = 5000, ds = 0.004;
      for (let k = 0; k < M; k++) {
        const u = R.gauss() * wsh, mr = mref + 0.18 * span * R.gauss(), c = 1 + 0.35 * (mr - mref) / span, col = kelvin(fromMired(mr), wb);
        let x = cx - dx * 1.2 - dy * u, y = 0.5 - dy * 1.2 + dx * u, tx = dx, ty = dy;
        const sig = 0.0015 + 0.0015 * R(), e = Psh * Math.exp(-u * u / (2 * wsh * wsh) * 0.5) / M * ds;
        for (let s = 0; s < 2.6; s += ds) {
          const [n, gx, gy] = grad(x, y), gxc = gx * c, gyc = gy * c, dot = gxc * tx + gyc * ty;
          tx += ds * (gxc - dot * tx) / n; ty += ds * (gyc - dot * ty) / n;
          const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
          const nx = x + tx * ds, ny = y + ty * ds;
          if (ny < 1.15 && ny > -0.15 && nx > -0.3 && nx < A + 0.3) depositZ(L, z, x, y, nx, ny, sig, e, col);
          x = nx; y = ny;
        }
      }
    }
    return { layers: L, look: { blur: LAYER_BLUR.map((r) => [r, 0, 0, 0]), glare: [0.14, 0.1], autoExpo: [0.997, 2.0], vign: 0.3, tint: pal.tint, lift: pal.lift } };
  },
};
