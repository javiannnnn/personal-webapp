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

function MenuLink({
  href,
  glyph,
  label,
}: {
  href: string
  glyph: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center border-4 border-bark bg-sand px-6 py-4 font-pixel text-xl text-bark shadow-pixel transition-colors hover:bg-gold focus-visible:bg-gold focus-visible:outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-sm sm:w-60"
    >
      <span
        aria-hidden
        className="w-6 shrink-0 text-left text-mario opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        ►
      </span>
      <span className="flex flex-1 items-center justify-center gap-3 whitespace-nowrap">
        <span aria-hidden>{glyph}</span>
        {label}
      </span>
      <span aria-hidden className="w-6 shrink-0" />
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
      <div className="border-b-4 border-bark bg-cocoa">
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

      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
        <div
          aria-hidden
          className="float-bob mb-8 flex h-14 w-14 items-center justify-center border-4 border-bark bg-gold font-pixel text-2xl text-bark shadow-pixel-sm"
        >
          ?
        </div>

        <h1 className="max-w-3xl font-pixel text-4xl leading-tight text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-6xl">
          {data.about.displayName}
        </h1>
        <p className="mt-4 font-crt text-xl text-cocoa sm:text-2xl">
          {data.about.tagline}
        </p>
        <p className="mx-auto mt-6 max-w-xl font-crt text-lg leading-relaxed text-cocoa/90 sm:text-xl">
          {excerpt}
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col items-stretch gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <MenuLink href="/projects" glyph="▶" label="START" />
          <MenuLink href="/contact" glyph="✉" label="CONTACT" />
        </div>

        <p className="blink mt-12 font-pixel text-base text-brown sm:text-lg">
          ▼ INSERT COIN · PRESS START ▼
        </p>
      </section>
    </div>
  )
}
