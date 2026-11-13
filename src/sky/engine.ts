import atlas from './face-atlas.json'
import { COMP_FS, DRAW_FS, DRAW_VS, FULLSCREEN_VS, SIM_FS } from './shaders'

export type SkyOptions = {
  canvas: HTMLCanvasElement
  /** Home page only: the hero's particles play a looping clip of Luis's face. */
  face: boolean
  /** A crosshair that follows the pointer over the sky, with a live readout. */
  cursor?: { root: HTMLElement; label: HTMLElement; ring: HTMLElement }
  /** Called if WebGL2 isn't usable or the context is lost; the page falls back to CSS. */
  onFail: () => void
}

const LUMA_URL = '/assets/hero/face-luma.webp'
const DEPTH_URL = '/assets/hero/face-depth.webp'
const MAX_PARTICLES = 80_000

type Program = { prog: WebGLProgram; u: (name: string) => WebGLUniformLocation | null }

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

/** Starts the sky on `canvas`. Returns a stop function. Throws if WebGL2 can't run it. */
export function startSky({ canvas, face, cursor, onFail }: SkyOptions): () => void {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) throw new Error('WebGL2 float render targets unavailable')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let stopped = false
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  // ------------------------------------------------------------ programs

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
    return s
  }
  const program = (vs: string, fs: string): Program => {
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link')
    const cache = new Map<string, WebGLUniformLocation | null>()
    return {
      prog,
      u: (name) => {
        if (!cache.has(name)) cache.set(name, gl.getUniformLocation(prog, name))
        return cache.get(name)!
      },
    }
  }
  const sim = program(FULLSCREEN_VS, SIM_FS)
  const draw = program(DRAW_VS, DRAW_FS)
  const comp = program(FULLSCREEN_VS, COMP_FS)
  gl.bindVertexArray(gl.createVertexArray())

  gl.useProgram(draw.prog)
  gl.uniform3fv(draw.u('uInk'), hex('#1c1c1c'))
  gl.uniform3fv(draw.u('uAccent'), hex('#2352de'))
  gl.uniform3fv(draw.u('uDeep'), hex('#1f6f92'))

  // ------------------------------------------------------------ textures
  // Units: 0 luma atlas, 1 particle state (read), 2 particle homes, 3 scene, 4 depth atlas,
  // 5 scratch for creating textures.

  const floatTex = (w: number, h: number, data: Float32Array | null) => {
    const t = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, data)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    return t
  }
  const framebuffer = (tex: WebGLTexture) => {
    const f = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, f)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    return f
  }
  const imageTex = (unit: number, img: HTMLImageElement) => {
    const t = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }

  let W = 0
  let H = 0
  let dpr = 1
  let size = 1 // state texture is size × size
  let count = 0
  let home: WebGLTexture | null = null
  let states: { tex: WebGLTexture; fbo: WebGLFramebuffer }[] = []
  let sceneTex: WebGLTexture | null = null
  let sceneFbo: WebGLFramebuffer | null = null
  let read = 0

  /** Lays the particle grid over the viewport and resets every particle to its home. */
  const build = () => {
    // Create textures on a spare unit, so none lands on a unit a sampler reads from.
    gl.activeTexture(gl.TEXTURE5)
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    // Phones get a finer grid: the face is narrower there, and the screen holds fewer particles.
    const spacing = Math.max(W < 640 ? 4.5 : 6, Math.sqrt((W * H) / (0.9 * MAX_PARTICLES)))
    const pts: number[] = []
    let row = 0
    for (let y = -spacing; y < H + spacing; y += spacing * 0.9, row++) {
      for (let x = -spacing + (row % 2) * spacing * 0.5; x < W + spacing; x += spacing) pts.push(x, y)
    }
    count = pts.length / 2
    size = Math.ceil(Math.sqrt(count))
    const data = new Float32Array(size * size * 4)
    for (let i = 0; i < count; i++) data.set([pts[i * 2], pts[i * 2 + 1], Math.random(), 1], i * 4)

    if (home) gl.deleteTexture(home)
    states.forEach((s) => (gl.deleteTexture(s.tex), gl.deleteFramebuffer(s.fbo)))
    if (sceneTex) gl.deleteTexture(sceneTex)
    if (sceneFbo) gl.deleteFramebuffer(sceneFbo)

    home = floatTex(size, size, data)
    states = [0, 1].map(() => {
      const tex = floatTex(size, size, new Float32Array(size * size * 4))
      return { tex, fbo: framebuffer(tex) }
    })
    sceneTex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    sceneFbo = framebuffer(sceneTex)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    read = 0
  }
  build()

  // Phones resize the viewport as the address bar slides; only rebuild for real changes.
  let resizeTimer = 0
  const onResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth !== W || Math.abs(window.innerHeight - H) > 160) build()
    }, 120)
  }
  window.addEventListener('resize', onResize)

  // ------------------------------------------------------------ face atlas

  let faceReadyAt = -1
  let needsInit = false
  if (face) {
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    Promise.all([load(LUMA_URL), load(DEPTH_URL)])
      .then(([luma, depth]) => {
        if (stopped) return
        imageTex(0, luma)
        imageTex(4, depth)
        faceReadyAt = performance.now()
        needsInit = !reduced
      })
      .catch((error) => console.error('[sky] face atlas failed to load', error))
  }

  // ------------------------------------------------------------ input

  const pointer = { x: 0, y: 0, active: false, overSky: false }
  const cur = { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, tiltX: 0, tiltY: 0, hover: 0 }

  const onPointerMove = (e: PointerEvent) => {
    if (!pointer.active) {
      cur.x = e.clientX
      cur.y = e.clientY
    }
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.active = true
    // The crosshair belongs to the sky: not over the content column or a link.
    const target = e.target as Element | null
    pointer.overSky = finePointer && !target?.closest('.column, a, button, input, textarea')
  }
  const onPointerEnd = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') pointer.active = false
  }
  const onLeave = () => {
    pointer.active = false
    pointer.overSky = false
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', onPointerEnd, { passive: true })
  window.addEventListener('pointercancel', onPointerEnd, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)

  // ------------------------------------------------------------ loop

  let frame = 0
  const start = performance.now()
  let last = start
  let skip = false

  const onContextLost = (e: Event) => {
    e.preventDefault()
    stop()
    onFail()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)
  if (face) document.documentElement.style.setProperty('--hero', '1')
  if (finePointer) document.documentElement.classList.add('sky-live')

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    const scrollPx = window.scrollY
    const hero = face ? 1 - Math.min(1, Math.max(0, scrollPx / H)) : 0

    // Below the hero the sky is calm; half the frame rate is plenty.
    skip = hero === 0 && !skip
    if (skip) return

    const dt = Math.min((now - last) / 1000, 1 / 30)
    last = now
    const t = (now - start) / 1000
    if (face) document.documentElement.style.setProperty('--hero', hero.toFixed(3))

    // Cursor: eased position and velocity.
    const px = cur.x
    const py = cur.y
    if (pointer.active) {
      cur.x += (pointer.x - cur.x) * 0.4
      cur.y += (pointer.y - cur.y) * 0.4
    }
    const ivx = pointer.active ? (cur.x - px) / Math.max(dt, 1e-3) : 0
    const ivy = pointer.active ? (cur.y - py) / Math.max(dt, 1e-3) : 0
    cur.vx += (ivx - cur.vx) * 0.5
    cur.vy += (ivy - cur.vy) * 0.5
    const speed = Math.hypot(cur.vx, cur.vy)
    const norm = Math.min(speed / 1800, 1)
    cur.speed += (norm - cur.speed) * (norm > cur.speed ? 0.5 : 0.06)

    if (cursor) {
      cursor.root.classList.toggle('is-on', pointer.active && pointer.overSky)
      if (pointer.active) {
        cursor.root.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
        cursor.label.textContent = `X ${(pointer.x / W).toFixed(3)}  Y ${(pointer.y / H).toFixed(3)}\nΔ ${String(Math.round(speed)).padStart(4, '0')} PX/S`
        cursor.ring.style.transform = `scale(${(1 + Math.min(speed / 1400, 1.2)).toFixed(3)})`
      }
    }

    // Face square, bottom-anchored, sinking a little as the page scrolls.
    const faceSize = Math.min(H * 0.9, W * (W < 640 ? 1.05 : 0.6))
    const fx = (W - faceSize) / 2
    const fy = H - faceSize + scrollPx * 0.35

    // Hovering the face keeps it glitching: torn rows and a colour split, even when slow.
    const overFace =
      pointer.active && hero > 0 && pointer.x > fx && pointer.x < fx + faceSize && pointer.y > fy && pointer.y < fy + faceSize
    cur.hover += ((overFace && !reduced ? 1 : 0) - cur.hover) * 0.08

    const tx = pointer.active ? (pointer.x / W) * 2 - 1 : 0
    const ty = pointer.active ? (pointer.y / H) * 2 - 1 : 0
    cur.tiltX += (tx - cur.tiltX) * 0.04
    cur.tiltY += (ty - cur.tiltY) * 0.04

    // The clip loops; neighbouring frames blend, so a low frame rate still reads as smooth
    // motion. A clip whose ends don't match plays forward then backward instead (pingpong),
    // so it never jumps from its last frame back to its first.
    const end = atlas.frames - 1
    const leg = (t * atlas.fps) % (atlas.pingpong ? 2 * end : atlas.frames)
    const tf = reduced ? atlas.poster : leg <= end ? leg : 2 * end - leg
    const next = atlas.pingpong ? Math.min(Math.floor(tf) + 1, end) : (Math.floor(tf) + 1) % atlas.frames
    const frames: [number, number, number] = [Math.floor(tf), next, tf - Math.floor(tf)]

    const hasFace = face && faceReadyAt > 0
    const assemble = reduced ? 2 : hasFace ? Math.max(0, (now - faceReadyAt) / 1000 - 0.1) / 1.7 : 0
    const cursorX = pointer.active ? cur.x : -9999
    const cursorY = pointer.active ? cur.y : -9999

    const setFace = (p: Program) => {
      gl.uniform1i(p.u('uLuma'), 0)
      gl.uniform1i(p.u('uDepth'), 4)
      gl.uniform4f(p.u('uAtlas'), atlas.cols, atlas.rows, atlas.tile, hasFace ? 1 : 0)
      gl.uniform3f(p.u('uFrames'), ...frames)
      gl.uniform3f(p.u('uFace'), fx, fy, faceSize)
    }

    // 1. Physics.
    gl.disable(gl.BLEND)
    gl.useProgram(sim.prog)
    gl.viewport(0, 0, size, size)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, states[read].tex)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, home)
    gl.bindFramebuffer(gl.FRAMEBUFFER, states[1 - read].fbo)
    setFace(sim)
    gl.uniform1i(sim.u('uState'), 1)
    gl.uniform1i(sim.u('uHome'), 2)
    gl.uniform2f(sim.u('uCursor'), cursorX, cursorY)
    gl.uniform2f(sim.u('uCursorVel'), reduced ? 0 : cur.vx, reduced ? 0 : cur.vy)
    gl.uniform1f(sim.u('uTime'), reduced ? 0 : t)
    gl.uniform1f(sim.u('uDt'), reduced ? 0 : dt)
    gl.uniform1f(sim.u('uHero'), hero)
    gl.uniform1f(sim.u('uAssemble'), assemble)
    gl.uniform1f(sim.u('uInit'), needsInit ? 1 : 0)
    gl.uniform1f(sim.u('uCursorK'), reduced ? 0 : 1)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    needsInit = false
    read = 1 - read

    // 2. Particles into the scene buffer.
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.useProgram(draw.prog)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, states[read].tex)
    setFace(draw)
    gl.uniform1i(draw.u('uState'), 1)
    gl.uniform1i(draw.u('uHome'), 2)
    gl.uniform1i(draw.u('uSize'), size)
    gl.uniform2f(draw.u('uRes'), W, H)
    gl.uniform2f(draw.u('uTilt'), reduced ? 0 : cur.tiltX, reduced ? 0 : cur.tiltY)
    gl.uniform1f(draw.u('uDpr'), dpr)
    gl.uniform1f(draw.u('uTime'), reduced ? 0 : t)
    gl.uniform1f(draw.u('uHero'), hero)
    gl.uniform1f(draw.u('uScrollPx'), scrollPx)
    gl.uniform1f(draw.u('uSweep'), reduced ? -9999 : ((t % 11) / 8) * (W * 0.55 + H + 500) - 250)
    gl.drawArrays(gl.POINTS, 0, count)

    // 3. Composite to the screen.
    gl.disable(gl.BLEND)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.useProgram(comp.prog)
    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.uniform1i(comp.u('uScene'), 3)
    gl.uniform2f(comp.u('uRes'), W, H)
    gl.uniform1f(comp.u('uDpr'), dpr)
    gl.uniform2f(comp.u('uCursor'), cursorX, cursorY)
    gl.uniform2f(comp.u('uGlow'), fx + faceSize / 2, fy + faceSize * 0.5)
    gl.uniform1f(comp.u('uSpeed'), reduced ? 0 : Math.max(cur.speed, cur.hover * 0.4))
    gl.uniform1f(comp.u('uHero'), hero)
    gl.uniform1f(comp.u('uTime'), reduced ? 0 : t)
    gl.uniform1f(comp.u('uScrollPx'), scrollPx)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  frame = requestAnimationFrame(tick)

  function stop() {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    window.clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerEnd)
    window.removeEventListener('pointercancel', onPointerEnd)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    document.documentElement.classList.remove('sky-live')
    document.documentElement.style.removeProperty('--hero')
    cursor?.root.classList.remove('is-on')
  }
  return stop
}
