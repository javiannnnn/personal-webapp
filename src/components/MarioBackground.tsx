'use client'

import { useEffect, useRef, useState } from 'react'

/* Classic-inspired 12x16 small-Mario sprite maps.
   R = red, B = brown, S = skin, Y = button gold */
const COLORS: Record<string, string> = {
  R: '#d63a2f',
  B: '#6b4a2c',
  S: '#f0b98a',
  Y: '#ffc82c',
}

const FRAME_STAND = [
  '....RRRRR...',
  '..RRRRRRRRR.',
  '..BBBSSBS...',
  '.BSBSSSBSSS.',
  '.BSBBSSSBSS.',
  '.BBSSSSBBBB.',
  '...SSSSSSS..',
  '..RRBRRRB...',
  '.RRRBRRBRRR.',
  'RRRRBBBBRRRR',
  'SSRBYBBYBRSS',
  'SSSBBBBBBSSS',
  'SSBBBBBBBBSS',
  '..BBB..BBB..',
  '.BBB....BBB.',
  'BBBB....BBBB',
]

const FRAME_WALK = [
  ...FRAME_STAND.slice(0, 13),
  '...BBB.BBB..',
  '..BBB...BBB.',
  '..BBB....BBB',
]

const PX = 3 // css pixels per sprite pixel
const SPRITE_W = 12 * PX
const SPRITE_H = 16 * PX
const GROUND_H = 46
const SPEED = 55
const JUMP_V = -520
const GRAVITY = 1400
const COIN_R = 10

type Coin = { x: number; y: number; baseY: number; phase: number; collected: boolean }
type Sparkle = { x: number; y: number; vx: number; vy: number; life: number }
type Cloud = { x: number; y: number; scale: number; speed: number }

function makeCoins(width: number, groundY: number): Coin[] {
  const count = Math.max(3, Math.floor(width / 230))
  const margin = 100
  const span = Math.max(1, width - margin * 2)
  return Array.from({ length: count }, (_, i) => {
    const baseY = groundY - 88 - Math.random() * 55
    return {
      x: margin + (span / count) * i + Math.random() * 40,
      y: baseY,
      baseY,
      phase: Math.random() * Math.PI * 2,
      collected: false,
    }
  })
}

function makeClouds(width: number, height: number): Cloud[] {
  const count = Math.max(3, Math.round(width / 420))
  const span = Math.max(1, width / count)
  return Array.from({ length: count }, (_, i) => ({
    x: i * span + Math.random() * span * 0.5,
    y: 50 + Math.random() * Math.min(height * 0.28, 220),
    scale: 0.75 + Math.random() * 0.6,
    speed: 1.5 + Math.random() * 2,
  }))
}

/* Classic three-puff cloud, blocky pixel style */
const CLOUD_MAP = [
  '.....WWWWW.........',
  '...WWWWWWWWW..WWW..',
  '..WWWWWWWWWWWWWWWW.',
  '.WWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWWWWW',
  'DDDDDDDDDDDDDDDDDDD',
]
const CLOUD_CELL = 4 // css px per cell at scale 1
const CLOUD_W = CLOUD_MAP[0].length * CLOUD_CELL

const CLOUD_COLORS: Record<string, string> = {
  W: '#fdf6e3',
  D: '#dcc496',
}

function drawCloud(ctx: CanvasRenderingContext2D, cloud: Cloud) {
  const s = cloud.scale * CLOUD_CELL
  ctx.save()
  ctx.globalAlpha = 0.65
  for (let row = 0; row < CLOUD_MAP.length; row++) {
    const line = CLOUD_MAP[row]
    for (let col = 0; col < line.length; col++) {
      const ch = line[col]
      if (ch === '.') continue
      ctx.fillStyle = CLOUD_COLORS[ch]
      ctx.fillRect(
        Math.round(cloud.x + col * s),
        Math.round(cloud.y + row * s),
        Math.ceil(s),
        Math.ceil(s),
      )
    }
  }
  ctx.restore()
}

function drawSky(ctx: CanvasRenderingContext2D, width: number, groundY: number) {
  ctx.fillStyle = '#5c94fc'
  ctx.fillRect(0, 0, width, groundY)
}

function drawGround(ctx: CanvasRenderingContext2D, width: number, groundY: number, offset: number) {
  const brickW = 34
  const brickH = 23
  ctx.fillStyle = '#b5854e'
  ctx.fillRect(0, groundY, width, GROUND_H)

  ctx.fillStyle = '#96683a'
  const startRow = -Math.ceil(offset / brickW)
  for (let row = 0; groundY + row * brickH < groundY + GROUND_H; row++) {
    const y = groundY + row * brickH
    const shift = row % 2 === 0 ? 0 : brickW / 2
    for (let col = startRow; col * brickW + shift < width + brickW; col++) {
      ctx.fillRect(col * brickW + shift + 2, y + 2, brickW - 4, brickH - 4)
    }
  }
  ctx.fillStyle = 'rgba(43,29,16,0.45)'
  ctx.fillRect(0, groundY, width, 3)
}

function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin, t: number) {
  const spin = Math.abs(Math.cos(t * 3 + coin.phase))
  const rx = COIN_R * Math.max(0.18, spin)
  const bob = Math.sin(t * 2 + coin.phase) * 5
  const y = coin.baseY + bob

  ctx.fillStyle = '#8a6414'
  ctx.beginPath()
  ctx.ellipse(coin.x + 1.5, y + 1.5, rx, COIN_R, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffc82c'
  ctx.beginPath()
  ctx.ellipse(coin.x, y, rx, COIN_R, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffe388'
  ctx.beginPath()
  ctx.ellipse(coin.x, y, rx * 0.55, COIN_R * 0.62, 0, 0, Math.PI * 2)
  ctx.fill()
  if (rx > COIN_R * 0.5) {
    ctx.fillStyle = '#c79a1d'
    ctx.fillRect(coin.x - 1.5, y - COIN_R * 0.5, 3, COIN_R)
  }
}

function drawMario(
  ctx: CanvasRenderingContext2D,
  frame: string[],
  x: number,
  y: number,
) {
  for (let row = 0; row < frame.length; row++) {
    const line = frame[row]
    for (let col = 0; col < line.length; col++) {
      const ch = line[col]
      if (ch === '.') continue
      ctx.fillStyle = COLORS[ch]
      ctx.fillRect(x + col * PX, y + row * PX, PX, PX)
    }
  }
}

export default function MarioBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let width = 0
    let height = 0
    let groundY = 0
    let marioX = -SPRITE_W
    let marioY = 0 // 0 = on the ground; goes negative mid-jump
    let vy = 0
    let jumping = false
    let coinList: Coin[] = []
    let cloudList: Cloud[] = []
    const sparkles: Sparkle[] = []
    let last = performance.now()
    let t = 0
    let scrollX = 0
    let legTimer = 0
    let legFrame = false

    const drawScene = (standStill: boolean) => {
      ctx.clearRect(0, 0, width, height)
      drawSky(ctx, width, groundY)
      for (const cloud of cloudList) drawCloud(ctx, cloud)
      drawGround(ctx, width, groundY, scrollX)
      for (const coin of coinList) {
        if (!coin.collected || standStill) drawCoin(ctx, coin, t)
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i]
        s.life -= 1
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.25
        if (s.life <= 0) {
          sparkles.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(s.life / 30, 0)
        ctx.fillStyle = '#ffe388'
        ctx.fillRect(s.x - 2, s.y - 2, 5, 5)
        ctx.globalAlpha = 1
      }
      const frame = !standStill && !jumping && legFrame ? FRAME_WALK : FRAME_STAND
      drawMario(ctx, frame, marioX, groundY - SPRITE_H + marioY)
    }

    const drawStatic = () => {
      t = 1.2
      marioX = Math.min(Math.max(width * 0.72, 40), width - SPRITE_W - 20)
      drawGround(ctx, width, groundY, 0)
      for (const coin of coinList) drawCoin(ctx, coin, t)
      drawMario(ctx, FRAME_STAND, marioX, groundY - SPRITE_H)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      groundY = height - GROUND_H
      coinList = makeCoins(width, groundY)
      // Keep existing clouds where they are; only seed them once.
      if (cloudList.length === 0) cloudList = makeClouds(width, height)
      else {
        const maxY = 50 + Math.min(height * 0.28, 220)
        for (const c of cloudList) c.y = Math.min(c.y, maxY)
      }
      if (reduced) drawStatic()
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt

      marioX += SPEED * dt
      scrollX += SPEED * dt

      // Clouds drift slowly and wrap around
      for (const cloud of cloudList) {
        cloud.x -= cloud.speed * dt
        const w = CLOUD_W * cloud.scale
        if (cloud.x < -w - 20) {
          cloud.x = width + 20
          cloud.y = 50 + Math.random() * Math.min(height * 0.28, 220)
          cloud.scale = 0.75 + Math.random() * 0.6
        }
      }

      // Walk cycle
      if (!jumping) {
        legTimer += dt
        if (legTimer > 0.16) {
          legTimer = 0
          legFrame = !legFrame
        }
      }

      // Start a jump when close to an uncollected coin
      if (!jumping) {
        for (const coin of coinList) {
          if (!coin.collected && Math.abs(coin.x - (marioX + SPRITE_W / 2)) < 10) {
            jumping = true
            vy = JUMP_V
            break
          }
        }
      } else {
        vy += GRAVITY * dt
        marioY += vy * dt
        if (marioY >= 0) {
          marioY = 0
          vy = 0
          jumping = false
        }
      }

      // Collect coins mid-air
      const mx = marioX + SPRITE_W / 2
      const my = groundY - SPRITE_H / 2 + marioY
      for (const coin of coinList) {
        if (coin.collected) continue
        const bob = Math.sin(t * 2 + coin.phase) * 5
        const cy = coin.baseY + bob
        if ((mx - coin.x) ** 2 + (my - cy) ** 2 < 30 ** 2) {
          coin.collected = true
          setScore((s) => s + 1)
          for (let i = 0; i < 8; i++) {
            sparkles.push({
              x: coin.x,
              y: cy,
              vx: (Math.random() - 0.5) * 160,
              vy: -Math.random() * 180 - 40,
              life: 30,
            })
          }
        }
      }

      // Wrap around and respawn coins
      if (marioX > width + SPRITE_W) {
        marioX = -SPRITE_W
        coinList = makeCoins(width, groundY)
      }

      drawScene(false)
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) {
      raf = requestAnimationFrame((now) => {
        last = now
        tick(now)
      })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="block opacity-70" />
      <div className="absolute left-4 top-20 flex items-center gap-2 font-pixel text-sm text-bark/70 sm:text-base">
        <span className="inline-block h-4 w-4 rounded-full border-2 border-[#8a6414] bg-gold shadow-[inset_0_0_0_2px_#ffe388]" />
        <span>× {String(score).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
