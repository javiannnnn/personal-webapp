import type { Metadata } from 'next'
import Link from 'next/link'
import { getPortfolio } from '@/lib/db'
import { PixelHeart } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Player One',
}

function getExcerpt(bio: string) {
  const firstParagraph = bio.split('\n\n')[0] ?? ''
  const sentences = firstParagraph.match(/[^.!?]+[.!?]/g)
  if (!sentences || sentences.length === 0) return firstParagraph.trim()
  return sentences.slice(0, 2).join(' ').trim()
}

/* Authentic-SMB action button: chunky hard border, hard offset shadow,
   press sinks like a real block on the grid. */
function StartButton({
  href,
  glyph,
  label,
  variant,
}: {
  href: string
  glyph: string
  label: string
  variant: 'coin' | 'pipe'
}) {
  const palette =
    variant === 'coin'
      ? 'border-[#7a5210] bg-gold text-bark shadow-[0_6px_0_0_#3a2802] hover:bg-coin active:shadow-[0_2px_0_0_#3a2802]'
      : 'border-[#1f5c21] bg-smb-pipe text-smb-cream shadow-[0_6px_0_0_#123816] hover:bg-smb-pipe-dark active:shadow-[0_2px_0_0_#123816]'

  return (
    <Link
      href={href}
      className={`group relative flex w-full items-center justify-center gap-3 border-4 px-8 py-4 font-pixel text-xl tracking-wide transition-all focus-visible:outline-none active:translate-y-1 ${palette}`}
    >
      <span
        aria-hidden
        className="w-5 shrink-0 text-left transition-transform group-hover:translate-x-1"
      >
        {glyph}
      </span>
      <span className="whitespace-nowrap">{label}</span>
      <span aria-hidden className="w-5 shrink-0" />
    </Link>
  )
}

export default async function HomePage() {
  const data = await getPortfolio()
  const excerpt = getExcerpt(data.about.bio)
  const level =
    data.skills.length > 0
      ? Math.round(
          data.skills.reduce((sum, skill) => sum + skill.level, 0) /
            data.skills.length
        )
      : 1

  return (
    <div className="flex flex-1 flex-col">
      {/* SMB HUD — dark bottomed strip of gold telemetry */}
      <div className="border-b-4 border-smb-shadow bg-bark/90">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-2 font-pixel text-sm text-gold sm:text-base">
          <span className="flex items-center gap-2">
            LIVES
            <span className="flex gap-1">
              <PixelHeart />
              <PixelHeart />
              <PixelHeart />
            </span>
          </span>
          <span>PROJECTS ×{data.projects.length}</span>
          <span>SKILLS ×{data.skills.length}</span>
          <span>LV.{level}</span>
        </div>
      </div>

      {/* Start screen — sits over the live sky-blue canvas behind it */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:py-20">
        {/* ?-coin — floats and links to the warp console */}
        <Link
          href="/warp"
          aria-label="Open the warp console"
          className="float-bob mb-8 flex h-14 w-14 items-center justify-center border-4 border-[#8a6414] bg-gold font-pixel text-2xl text-bark shadow-[4px_4px_0_0_var(--color-smb-shadow)] transition-colors hover:bg-coin focus-visible:outline-none active:translate-y-[2px] active:shadow-none"
        >
          ?
        </Link>

        <h1 className="max-w-3xl font-pixel text-[2.75rem] leading-[1.05] text-gold drop-shadow-[4px_4px_0_var(--color-smb-shadow)] sm:text-7xl">
          {data.about.displayName}
        </h1>

        <p className="mt-5 font-crt text-2xl text-smb-cream drop-shadow-[2px_2px_0_var(--color-smb-shadow)] sm:text-3xl">
          &#9733; {data.about.tagline.toUpperCase()} &#9733;
        </p>

        {/* Bio sits on a dark panel so body copy clears 4.5:1 over the sky */}
        <p className="mx-auto mt-7 max-w-xl border-4 border-smb-shadow bg-bark/85 px-6 py-4 font-crt text-xl leading-relaxed text-smb-cream sm:text-2xl">
          {excerpt}
        </p>

        <div className="mt-12 flex w-full max-w-xs flex-col items-stretch gap-5 sm:w-auto sm:max-w-none sm:flex-row">
          <StartButton href="/projects" glyph="▶" label="START" variant="coin" />
          <StartButton href="/contact" glyph="✉" label="CONTACT" variant="pipe" />
        </div>

        <p className="blink mt-12 font-pixel text-lg text-gold drop-shadow-[2px_2px_0_var(--color-smb-shadow)] sm:text-xl">
          ▼ INSERT COIN · PRESS START ▼
        </p>
      </section>
    </div>
  )
}
