/**
 * Shaders for the sky: a field of ~40k particles that, in the home page hero, forms
 * Luis's face from a pre-built atlas of video frames (see scripts/face-atlas/build.py).
 *
 * Three passes per frame:
 * 1. SIM: physics. Each particle stores its offset from a fixed grid point ("home") and
 *    its velocity in a float texture; the cursor drags and scatters them, springs pull
 *    them home.
 * 2. DRAW: one point per particle into an offscreen buffer. Face particles are square
 *    halftone tiles sized by the frame's darkness; field particles are round dots.
 * 3. COMPOSITE: paints the sky (with light scanlines in the hero), then lays the
 *    particles over it with a chromatic split and torn rows near a fast cursor, and grain.
 *
 * All positions are CSS pixels, y down.
 */

const NOISE = /* glsl */ `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), f.x), f.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= .5; } return v; }
`

const FACE = /* glsl */ `
${NOISE}
vec2 curl(vec2 p){
  float e = .15;
  float a = fbm(p + vec2(0, e)), b = fbm(p - vec2(0, e)), c = fbm(p + vec2(e, 0)), d = fbm(p - vec2(e, 0));
  return vec2(a - b, -(c - d)) / (2. * e);
}

uniform sampler2D uLuma;   // atlas: brightness per frame, 0 = dark
uniform sampler2D uDepth;  // atlas: 0 outside the person, 0.25 (far) .. 1 (near) inside
uniform vec4 uAtlas;       // cols, rows, tile size in px, 1 when the face is shown
uniform vec3 uFrames;      // tile A, tile B, mix between them
uniform vec3 uFace;        // face square: x, y, size

vec2 tileUV(vec2 uv, float i){
  vec2 inset = vec2(.5 / uAtlas.z);
  uv = clamp(uv, inset, 1. - inset);
  return (vec2(mod(i, uAtlas.x), floor(i / uAtlas.x)) + uv) / uAtlas.xy;
}

// What the current frame says about a grid point: is it the person, how dark, how near.
void faceAt(vec2 home, out float mask, out float lum, out float depth){
  mask = 0.; lum = 1.; depth = 0.;
  if (uAtlas.w < .5) return;
  vec2 uv = (home - uFace.xy) / uFace.z;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return;
  vec2 a = tileUV(uv, uFrames.x), b = tileUV(uv, uFrames.y);
  lum = mix(textureLod(uLuma, a, 0.).r, textureLod(uLuma, b, 0.).r, uFrames.z);
  float v = mix(textureLod(uDepth, a, 0.).r, textureLod(uDepth, b, 0.).r, uFrames.z);
  // The clip is cut off at the bottom and sides; fade those edges into the field.
  float edge = smoothstep(0., .05, uv.x) * smoothstep(1., .95, uv.x) * smoothstep(1., .9, uv.y);
  mask = smoothstep(.06, .22, v) * edge;
  depth = clamp((v - .25) / .75, 0., 1.);
}
`

export const FULLSCREEN_VS = /* glsl */ `#version 300 es
void main(){ vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2); gl_Position = vec4(p * 2. - 1., 0., 1.); }`

export const SIM_FS = /* glsl */ `#version 300 es
precision highp float;
${FACE}
uniform sampler2D uState, uHome;
uniform vec2 uCursor, uCursorVel;
uniform float uTime, uDt, uHero, uAssemble, uInit, uCursorK;
out vec4 o;

void main(){
  ivec2 id = ivec2(gl_FragCoord.xy);
  vec4 h = texelFetch(uHome, id, 0);
  if (h.w < .5) { o = vec4(0); return; }
  vec2 home = h.xy; float seed = h.z;
  float mask, lum, depth; faceAt(home, mask, lum, depth);

  if (uInit > .5) {
    // Opening shot: the face starts as a scattered swarm around the screen.
    float ang = seed * 43.98; float r = 260. + hash(home + 9.1) * 760.;
    o = vec4(vec2(cos(ang), sin(ang)) * r * step(.05, mask), 0., 0.);
    return;
  }

  vec4 s = texelFetch(uState, id, 0);
  vec2 off = s.xy, vel = s.zw;
  vec2 pos = home + off;

  // Scrolling away, the face lifts off as dust mid-way, then settles into the field.
  float dis = mask * sin(3.14159 * clamp(1. - uHero, 0., 1.));
  vec2 target = (curl(home * .004 + vec2(0., uTime * .04)) * 140. + vec2(0., -80. - seed * 200.)) * dis;

  float loose = smoothstep(4., 40., length(off - target));
  float ramp = mix(1., smoothstep(seed * .55, seed * .55 + .45, uAssemble), step(.05, mask));
  vec2 acc = (target - off) * mix(44., 9., loose) * ramp;

  // Cursor: each particle takes the hit a little differently, so the face shatters unevenly.
  vec2 d = pos - uCursor;
  float f = exp(-dot(d, d) / (2. * 64. * 64.));
  float speed = min(length(uCursorVel), 2600.);
  float ck = uCursorK * mix(.3, 1., uHero);
  float kick = .6 + hash(home + 2.3) * 2.2;
  vec2 side = vec2(-uCursorVel.y, uCursorVel.x) * (hash(home + 4.7) - .5) * 1.6;
  acc += (uCursorVel * kick + side) * f * 5. * ck;
  acc += d / max(length(d), 1.) * f * speed * 1.4 * ck;
  vec2 swirl = curl(pos * .011 + vec2(uTime * .3, -uTime * .2));
  acc += swirl * (f * speed * 2.6 * ck + (1. - ramp) * 520. * mask);
  // Even a resting cursor keeps the face coming apart under it: fast, fine turbulence that
  // pulls particles loose; once the cursor leaves, the springs bring them home.
  vec2 jitter = curl(home * .05 + vec2(uTime * 1.7, uTime * 1.3));
  acc += jitter * f * (180. + 1500. * mask * uHero) * ck;
  acc.y += loose * 60. * hash(home + 6.1);  // free particles fall a little, like debris

  vel += acc * uDt;
  vel *= exp(-mix(6.4, 2.6, loose) * uDt);
  float vm = length(vel); if (vm > 3200.) vel *= 3200. / vm;
  off += vel * uDt;
  o = vec4(off, vel);
}`

export const DRAW_VS = /* glsl */ `#version 300 es
precision highp float;
${FACE}
uniform sampler2D uState, uHome;
uniform int uSize;
uniform vec2 uRes, uTilt;
uniform float uDpr, uTime, uHero, uScrollPx, uSweep;
uniform vec3 uInk, uAccent, uDeep;
out float vAlpha;
out vec3 vColor;
out float vSquare;
out vec2 vDir;
out float vStretch;

void main(){
  ivec2 id = ivec2(gl_VertexID % uSize, gl_VertexID / uSize);
  vec4 h = texelFetch(uHome, id, 0);
  if (h.w < .5) { gl_Position = vec4(2., 2., 0., 1.); gl_PointSize = 0.; return; }
  vec4 s = texelFetch(uState, id, 0);
  vec2 home = h.xy; float seed = h.z;
  float mask, lum, depth; faceAt(home, mask, lum, depth);
  vec2 off = s.xy, vel = s.zw;

  float faceAmt = mask * smoothstep(0., .65, uHero);
  float fieldH = smoothstep(.36, .8, fbm(home * .0032 + vec2(uTime * .015, uScrollPx * .0011 + uTime * .008)));
  float sweep = exp(-pow((home.x * .55 + home.y - uSweep) / 120., 2.));

  vec2 p = home + off;
  p.y -= fieldH * 5. * (1. - faceAmt);          // the field undulates like fabric
  p += uTilt * depth * faceAmt * vec2(8., 6.);  // a little parallax by depth
  p.y -= depth * faceAmt * 6.;

  float speed = length(vel);
  float hot = smoothstep(60., 800., speed);
  float loose = smoothstep(5., 45., length(off));
  float dark = smoothstep(.1, .92, 1. - lum);

  float fieldSize = .62 + fieldH * 1.15 + sweep * .55;
  // The darkest tiles slightly overlap their row neighbours, like solid ink in print.
  float faceSize = mix(.55, 2.55, dark) + smoothstep(.85, 1., dark) * .45;
  float size = mix(fieldSize, faceSize, faceAmt) * mix(1., .45 + seed * .85, loose);
  float fieldA = (.13 + fieldH * .3 + sweep * .14) * mix(.7, 1., uHero);
  vAlpha = mix(fieldA, .9, faceAmt) * mix(1., .75, loose);

  vec3 c = mix(uInk, uDeep, sweep * .55 * (1. - faceAmt));
  vColor = mix(c, uAccent, clamp(max(hot, loose * .85), 0., 1.));
  vSquare = faceAmt;

  // Fast particles stretch along their motion into streaks.
  vStretch = 1. + min(speed / 260., 3.2) * hot;
  vDir = speed > 1. ? vel / speed : vec2(1., 0.);
  gl_PointSize = size * 2. * vStretch * uDpr + 1.;
  gl_Position = vec4(p.x / uRes.x * 2. - 1., 1. - p.y / uRes.y * 2., 0., 1.);
}`

export const DRAW_FS = /* glsl */ `#version 300 es
precision highp float;
in float vAlpha;
in vec3 vColor;
in float vSquare;
in vec2 vDir;
in float vStretch;
out vec4 o;
void main(){
  vec2 q = (gl_PointCoord - .5) * vStretch;
  float along = dot(q, vDir) / vStretch;
  float perp = dot(q, vec2(-vDir.y, vDir.x));
  float roundR = length(vec2(along, perp));
  float squareR = max(abs(q.x), abs(q.y)) * 1.06;
  float still = 1. - smoothstep(1., 1.4, vStretch);
  float r = mix(roundR, squareR, vSquare * still);
  float a = smoothstep(.5, .4, r) * vAlpha;
  o = vec4(vColor * a, a);
}`

export const COMP_FS = /* glsl */ `#version 300 es
precision highp float;
${NOISE}
uniform sampler2D uScene;
uniform vec2 uRes, uCursor, uGlow;
uniform float uDpr, uSpeed, uHero, uTime, uScrollPx;
out vec4 o;

vec4 scene(vec2 px){ return texture(uScene, vec2(px.x / uRes.x, 1. - px.y / uRes.y)); }

float clouds(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= .5; } return v; }

vec3 sky(vec2 px){
  vec2 uv = px / uRes;
  vec3 c = mix(vec3(.72, .87, .93), vec3(.44, .75, .86), smoothstep(0., 1., uv.y));
  c += (clouds(px * .0016 + vec2(uTime * .012, uScrollPx * .0006)) - .5) * .09;
  // Paper glow behind the face, fading out with the hero.
  vec2 g = (px - uGlow) / vec2(uRes.x * .36, uRes.y * .55);
  c = mix(c, vec3(.961, .961, .949), exp(-dot(g, g) * 1.6) * uHero * .92);
  return c;
}

void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;

  // Torn rows: near a fast cursor, slices of the image jump sideways for a few frames.
  float near = exp(-pow((px.y - uCursor.y) / 95., 2.)) * exp(-pow((px.x - uCursor.x) / 300., 2.));
  float tick = floor(uTime * 15.);
  float band = floor(px.y / 7.);
  float tear = (hash(vec2(band, tick)) - .5) * step(.62, hash(vec2(band * 1.7, tick + 3.)));
  vec2 sp = px + vec2(tear * 70. * near * uSpeed * uHero, 0.);

  // Chromatic split: strongest around a fast cursor, a hair at the screen edges.
  vec2 edge = px / uRes - .5;
  vec2 ca = normalize(px - uCursor + 1e-3) * near * uSpeed * 6. + edge * 1.6;
  vec4 sr = scene(sp + ca), sg = scene(sp), sb = scene(sp - ca);
  // Newsprint scanlines on the paper only: over the particle rows they would beat into moiré.
  vec3 bg = sky(px) * (1. - .04 * uHero * step(1.5, mod(px.y, 3.)));
  vec3 c = vec3(sr.r + bg.r * (1. - sr.a), sg.g + bg.g * (1. - sg.a), sb.b + bg.b * (1. - sb.a));

  c += (hash(px + fract(uTime * 7.3) * 100.) - .5) * .035;    // film grain
  c *= 1. - dot(edge, edge) * .1;                             // soft vignette
  o = vec4(c, 1.);
}`
