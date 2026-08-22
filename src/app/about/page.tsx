import type { Metadata } from 'next'
import { getPortfolio } from '@/lib/db'
import { Panel, SectionTitle } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Me',
}

export default async function AboutPage() {
  const data = await getPortfolio()
  const paragraphs = data.about.bio.split('\n\n').filter(Boolean)

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-10 px-4 py-12 sm:py-16">
      <header className="text-center">
        <h1 className="font-pixel text-3xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-4xl">
          ABOUT ME
        </h1>
        <p className="mt-3 font-crt text-xl text-cocoa sm:text-2xl">
          {data.about.displayName} — {data.about.tagline}
        </p>
      </header>

      <Panel>
        <SectionTitle>PLAYER PROFILE</SectionTitle>
        <div className="mb-5 flex flex-wrap items-center gap-3 border-b-4 border-dotted border-tan pb-4">
          <span className="border-2 border-bark bg-brown px-3 py-1 font-pixel text-sm text-gold">
            P1
          </span>
          <span className="font-pixel text-lg text-bark sm:text-xl">
            {data.about.displayName}
          </span>
          <span className="ml-auto flex items-center gap-2 font-pixel text-sm text-pipe">
            <span aria-hidden className="blink">
              ●
            </span>
            ONLINE
          </span>
        </div>
        <div className="space-y-4 font-crt text-lg leading-relaxed text-cocoa sm:text-xl">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionTitle>CHEAT CODES UNLOCKED</SectionTitle>
        <ul className="space-y-3">
          {data.about.funFacts.map((fact, index) => (
            <li
              key={index}
              className="flex items-start gap-3 font-crt text-lg text-cocoa sm:text-xl"
            >
              <span aria-hidden className="mt-1 shrink-0 text-mario">
                ►
              </span>
              {fact}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
