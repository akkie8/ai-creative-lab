// Shared "camera" for the five law prototypes.
// Light is drawn as soft segments into float32 accumulation layers (one per depth),
// each layer is defocused with a disc-shaped bokeh gather, a wide veiling glare is added,
// then the result is tone-mapped with a soft shoulder, given film grain and dithered.
'use strict';

// ---------- seeded PRNG ----------
function rng(seed) {
  let a = (seed >>> 0) ^ 0x9e3779b9, b = 0x243f6a88, c = 0xb7e15162, d = (seed * 2654435761) >>> 0;
  const next = () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11); d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
  for (let i = 0; i < 16; i++) next();
  const r = next;
  r.range = (lo, hi) => lo + (hi - lo) * r();
  r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  r.gauss = () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * r()); };
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  return r;
}

// ---------- colour of light at temperature T (linear sRGB, luminance 1) ----------
function kelvin(T, wb) {
  const f = (T) => {
    const u = (0.860117757 + 1.54118254e-4 * T + 1.28641212e-7 * T * T) / (1 + 8.42420235e-4 * T + 7.08145163e-7 * T * T);
    const v = (0.317398726 + 4.22806245e-5 * T + 4.20481691e-8 * T * T) / (1 - 2.89741816e-5 * T + 1.61456053e-7 * T * T);
    const x = 3 * u / (2 * u - 8 * v + 4), y = 2 * v / (2 * u - 8 * v + 4);
    const X = x / y, Z = (1 - x - y) / y;
    return [3.2406 * X - 1.5372 - 0.4986 * Z, -0.9689 * X + 1.8758 + 0.0415 * Z, 0.0557 * X - 0.2040 + 1.0570 * Z];
  };
  let c = f(T);
  if (wb) { const w = f(wb); c = [c[0] / w[0], c[1] / w[1], c[2] / w[2]]; }
  c = c.map((v) => Math.max(v, 0));
  const Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return c.map((v) => v / Y);
}

// ---------- a buffer of soft segments ----------
// Each segment: x0 y0 x1 y1 sigma r g b. rgb = energy per unit length (or total energy if x0==x1&&y0==y1).
class Strokes {
  constructor() { this.data = new Float32Array(1 << 20); this.n = 0; }
  push(x0, y0, x1, y1, s, r, g, b) {
    if ((this.n + 1) * 8 > this.data.length) { const d = new Float32Array(this.data.length * 2); d.set(this.data); this.data = d; }
    const o = this.n * 8, D = this.data;
    D[o] = x0; D[o + 1] = y0; D[o + 2] = x1; D[o + 3] = y1; D[o + 4] = s; D[o + 5] = r; D[o + 6] = g; D[o + 7] = b;
    this.n++;
  }
  // polyline with per-vertex sigma and colour-energy
  line(pts, sig, cols) {
    for (let i = 0; i + 1 < pts.length / 2; i++) {
      const s = 0.5 * (sig[i] + sig[i + 1]);
      const r = 0.5 * (cols[i * 3] + cols[i * 3 + 3]), g = 0.5 * (cols[i * 3 + 1] + cols[i * 3 + 4]), b = 0.5 * (cols[i * 3 + 2] + cols[i * 3 + 5]);
      this.push(pts[i * 2], pts[i * 2 + 1], pts[i * 2 + 2], pts[i * 2 + 3], s, r, g, b);
    }
  }
}

// ---------- WebGL2 camera ----------
class Lens {
  constructor(canvas, W, H, layers) {
    this.W = W; this.H = H; this.A = W / H; this.nL = layers;
    canvas.width = W; canvas.height = H;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) throw new Error('webgl2');
    this.gl = gl;
    for (const e of ['EXT_color_buffer_float', 'EXT_float_blend', 'OES_texture_float_linear']) if (!gl.getExtension(e)) throw new Error(e);
    const tex = (w, h, fmt, mip) => {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      const lv = mip ? Math.floor(Math.log2(Math.max(w, h))) + 1 : 1;
      gl.texStorage2D(gl.TEXTURE_2D, lv, fmt, w, h);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      return { t, f, w, h };
    };
    this.tex = tex;
    this.acc = []; for (let i = 0; i < layers; i++) this.acc.push(tex(W, H, gl.RGBA32F));
    this.src = tex(W, H, gl.RGBA16F, true);
    this.comp = tex(W, H, gl.RGBA32F);
    const gw = Math.ceil(W / 4), gh = Math.ceil(H / 4), gw2 = Math.ceil(W / 16), gh2 = Math.ceil(H / 16);
    this.g1 = [tex(gw, gh, gl.RGBA16F), tex(gw, gh, gl.RGBA16F)];
    this.g2 = [tex(gw2, gh2, gl.RGBA16F), tex(gw2, gh2, gl.RGBA16F)];

    const VQ = `#version 300 es
      in vec2 p; out vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0,1); }`;
    this.P = {};
    this.P.seg = this.prog(`#version 300 es
        layout(location=0) in vec2 corner;
        layout(location=1) in vec4 seg; layout(location=2) in vec4 sc;
        uniform float A; out vec2 w; flat out vec4 S; flat out vec4 C; flat out vec2 LS;
        void main(){
          vec2 a = seg.xy, b = seg.zw; float s = max(sc.x, 1e-5);
          vec2 d = b - a; float L = length(d); vec2 t = L > 1e-7 ? d / L : vec2(1,0); vec2 n = vec2(-t.y, t.x);
          float m = 3.3 * s;
          vec2 q = a + t * mix(-m, L + m, corner.x * 0.5 + 0.5) + n * (corner.y * m);
          w = q; S = vec4(a, t); C = vec4(sc.yzw, 0.0); LS = vec2(L, s);
          gl_Position = vec4(q.x / A * 2.0 - 1.0, q.y * 2.0 - 1.0, 0, 1);
        }`, `#version 300 es
        precision highp float; in vec2 w; flat in vec4 S; flat in vec4 C; flat in vec2 LS; out vec4 o;
        float Phi(float x){
          float z = abs(x) * 0.70710678; float t = 1.0/(1.0+0.3275911*z);
          float y = 1.0 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - 0.284496736)*t + 0.254829592)*t*exp(-z*z);
          return 0.5 + 0.5 * sign(x) * y; }
        void main(){
          vec2 r = w - S.xy; float u = dot(r, S.zw); float v = dot(r, vec2(-S.w, S.z));
          float s = LS.y, L = LS.x;
          float e;
          if (L < 1e-7) e = exp(-(u*u+v*v)/(2.0*s*s)) / (6.2831853*s*s);
          else e = exp(-v*v/(2.0*s*s)) / (2.5066283*s) * (Phi(u/s) - Phi((u-L)/s));
          o = vec4(C.rgb * e, 1.0);
        }`);
    this.P.copy = this.prog(VQ, `#version 300 es
        precision highp float; in vec2 uv; uniform sampler2D T; out vec4 o; void main(){ o = texture(T, uv); }`);
    this.P.bokeh = this.prog(VQ, `#version 300 es
        precision highp float; in vec2 uv; uniform sampler2D T; uniform vec2 texel; uniform vec4 R; uniform float fringe; out vec4 o;
        // R: radius in px = max(R.x, R.y + R.z * |uv.y - R.w|)
        void main(){
          float Rp = max(R.x, R.y + R.z * abs(uv.y - R.w));
          if (Rp < 0.6) { o = texture(T, uv); return; }
          const int N = 160;
          float lod = max(0.0, log2(Rp * 2.2 / sqrt(float(N))));
          vec3 acc = vec3(0); float ws = 0.0;
          for (int i = 0; i < N; i++) {
            float fi = float(i) + 0.5; float rho = sqrt(fi / float(N)); float th = fi * 2.39996323;
            vec2 d = vec2(cos(th), sin(th)) * rho * Rp * texel;
            float wt = 1.0 - 0.55 * smoothstep(0.78, 1.0, rho);
            acc.r += textureLod(T, uv + d * (1.0 + fringe), lod).r * wt;
            acc.g += textureLod(T, uv + d, lod).g * wt;
            acc.b += textureLod(T, uv + d * (1.0 - fringe), lod).b * wt;
            ws += wt;
          }
          o = vec4(acc / ws, 1.0);
        }`);
    this.P.blur = this.prog(VQ, `#version 300 es
        precision highp float; in vec2 uv; uniform sampler2D T; uniform vec2 dir; uniform float sig; out vec4 o;
        void main(){ vec3 a = vec3(0); float ws = 0.0;
          for (int i = -24; i <= 24; i++) { float x = float(i) / 24.0 * 3.0 * sig; float w = exp(-x*x/(2.0*sig*sig));
            a += texture(T, uv + dir * x).rgb * w; ws += w; }
          o = vec4(a / ws, 1.0); }`);
    this.P.final = this.prog(VQ, `#version 300 es
        precision highp float; in vec2 uv; uniform sampler2D C, G1, G2; uniform vec3 amb; uniform vec2 glare; uniform float expo, grain, seed, vign;
        uniform vec3 lift, tint; uniform vec2 res; out vec4 o;
        float h(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973) + seed); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
        float gn(vec2 p){ return (h(p) + h(p + 17.1) + h(p + 41.7) + h(p + 73.3) - 2.0) * 1.73; }
        vec3 srgb(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
        void main(){
          vec3 c = texture(C, uv).rgb + glare.x * texture(G1, uv).rgb + glare.y * texture(G2, uv).rgb;
          vec2 q = uv - 0.5; q.x *= res.x / res.y;
          c *= 1.0 - vign * dot(q, q);
          c = c * expo + amb;
          c *= tint;                               // camera white balance tint (green-magenta)
          // soft shoulder: mostly hue-preserving, so warm light stays amber instead of turning yellow,
          // with a gentle path to white only in the brightest highlights
          float Y0 = dot(c, vec3(0.2126, 0.7152, 0.0722));
          float Yt = 1.0 - exp(-Y0);
          vec3 hp = c * (Yt / max(Y0, 1e-6));
          vec3 pc = 1.0 - exp(-c);
          c = mix(hp, pc, 0.3);
          c = mix(c, vec3(Yt), smoothstep(0.55, 1.0, Yt) * 0.55);
          float mx = max(c.r, max(c.g, c.b)); if (mx > 1.0) c = mix(c / mx, vec3(1.0), 1.0 - 1.0 / mx);
          c = lift + (1.0 - lift) * c;             // gentle toe lift (the darkness is never pure black)
          c = srgb(clamp(c, 0.0, 1.0));
          vec2 px = gl_FragCoord.xy;
          float n = 0.62 * gn(px) + 0.38 * gn(floor(px * 0.5) + 311.0);   // fine, slightly clumped grain
          float Y = dot(c, vec3(0.2126, 0.7152, 0.0722));
          c += grain * n * (0.35 + 2.2 * Y * (1.0 - Y));
          c += (h(px + 7.7) + h(px + 91.3) - 1.0) / 255.0;                  // TPDF dither
          o = vec4(clamp(c, 0.0, 1.0), 1.0);
        }`);
    const qb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, qb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    this.quadBuf = qb;
    this.instBuf = gl.createBuffer();
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, qb); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 16); gl.vertexAttribDivisor(2, 1);
    this.qvao = gl.createVertexArray(); gl.bindVertexArray(this.qvao);
    gl.bindBuffer(gl.ARRAY_BUFFER, qb); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }
  prog(vs, fs) {
    const gl = this.gl;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    p.u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); p.u[a.name] = gl.getUniformLocation(p, a.name); }
    return p;
  }
  clear() {
    const gl = this.gl;
    for (const a of this.acc) { gl.bindFramebuffer(gl.FRAMEBUFFER, a.f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
  }
  draw(layer, strokes) {
    const gl = this.gl, P = this.P.seg;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.acc[layer].f); gl.viewport(0, 0, this.W, this.H);
    gl.useProgram(P); gl.uniform1f(P.u.A, this.A);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.bindVertexArray(this.vao);
    const CH = 1 << 19;
    for (let s = 0; s < strokes.n; s += CH) {
      const c = Math.min(CH, strokes.n - s);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
      gl.bufferData(gl.ARRAY_BUFFER, strokes.data.subarray(s * 8, (s + c) * 8), gl.STREAM_DRAW);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, c);
    }
    gl.disable(gl.BLEND); gl.bindVertexArray(null);
  }
  pass(P, target, setup) {
    const gl = this.gl; gl.useProgram(P);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.f : null);
    gl.viewport(0, 0, target ? target.w : this.W, target ? target.h : this.H);
    setup(P); gl.bindVertexArray(this.qvao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  bind(unit, t, loc) { const gl = this.gl; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(loc, unit); }
  // o: { blur:[{R:[min, base, grad, yCentre]} per layer] (in fractions of height), fringe, glare:[a,b], expo, amb:[r,g,b], grain, seed, vign, lift:[r,g,b] }
  render(o) {
    const gl = this.gl, H = this.H;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.comp.f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < this.nL; i++) {
      this.pass(this.P.copy, this.src, (P) => this.bind(0, this.acc[i].t, P.u.T));
      gl.bindTexture(gl.TEXTURE_2D, this.src.t); gl.generateMipmap(gl.TEXTURE_2D);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      const R = o.blur[i];
      this.pass(this.P.bokeh, this.comp, (P) => {
        this.bind(0, this.src.t, P.u.T); gl.uniform2f(P.u.texel, 1 / this.W, 1 / this.H);
        gl.uniform4f(P.u.R, R[0] * H, R[1] * H, R[2] * H, R[3]); gl.uniform1f(P.u.fringe, o.fringe ?? 0.02);
      });
      gl.disable(gl.BLEND);
    }
    // veiling glare, two scales
    const blurTo = (src, pair, sigFrac) => {
      this.pass(this.P.copy, pair[0], (P) => this.bind(0, src.t, P.u.T));
      const sx = sigFrac * pair[0].h;
      this.pass(this.P.blur, pair[1], (P) => { this.bind(0, pair[0].t, P.u.T); gl.uniform2f(P.u.dir, 1 / pair[0].w, 0); gl.uniform1f(P.u.sig, sx); });
      this.pass(this.P.blur, pair[0], (P) => { this.bind(0, pair[1].t, P.u.T); gl.uniform2f(P.u.dir, 0, 1 / pair[0].h); gl.uniform1f(P.u.sig, sx); });
    };
    if (o.autoExpo) {   // exposure from a luminance percentile of the composite (deterministic)
      this.pass(this.P.copy, this.g1[1], (P) => this.bind(0, this.comp.t, P.u.T));
      const g = this.g1[1], px = new Float32Array(g.w * g.h * 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, g.f); gl.readPixels(0, 0, g.w, g.h, gl.RGBA, gl.FLOAT, px);
      const Y = new Float32Array(g.w * g.h);
      for (let i = 0; i < Y.length; i++) Y[i] = 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];
      Y.sort();
      const v = Y[Math.min(Y.length - 1, Math.floor(o.autoExpo[0] * Y.length))];
      o.expo = o.autoExpo[1] / Math.max(v, 1e-9);
      this.lastExpo = o.expo;
    }
    blurTo(this.comp, this.g1, 0.035);
    blurTo(this.g1[0], this.g2, 0.14);
    this.pass(this.P.final, null, (P) => {
      this.bind(0, this.comp.t, P.u.C); this.bind(1, this.g1[0].t, P.u.G1); this.bind(2, this.g2[0].t, P.u.G2);
      gl.uniform3fv(P.u.amb, o.amb || [0, 0, 0]); gl.uniform2fv(P.u.glare, o.glare || [0.08, 0.06]);
      gl.uniform1f(P.u.expo, o.expo || 1); gl.uniform1f(P.u.grain, o.grain ?? 0.022); gl.uniform1f(P.u.seed, o.seed || 0);
      gl.uniform1f(P.u.vign, o.vign ?? 0.25); gl.uniform3fv(P.u.lift, o.lift || [0.004, 0.004, 0.006]); gl.uniform3fv(P.u.tint, o.tint || [1, 1, 1]);
      gl.uniform2f(P.u.res, this.W, this.H);
    });
    gl.finish();
  }
}

window.LAWS = window.LAWS || {};
