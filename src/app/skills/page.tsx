import type { Metadata } from 'next'
import { getPortfolio } from '@/lib/db'
import { Panel, SectionTitle } from '@/components/ui'
import SkillQuestBoard from '@/components/skills/SkillQuestBoard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Skills & Experience',
  description:
    'Player stats and level history — the skills Glen V. mains and the studios where the quests were completed.',
}

const pipBase = 'absolute -left-8 top-6 h-4 w-4 border-[3px] border-bark'

export default async function SkillsPage() {
  const data = await getPortfolio()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-brown/40 pb-3 font-pixel text-xs tracking-widest text-brown sm:text-sm">
        <p>WORLD 2-1 · PLAYER STATS</p>
        <p>SAVE FILE 01</p>
      </div>

      <header className="mb-10">
        <h1 className="font-pixel text-4xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-5xl">
          SKILLS &amp; EXPERIENCE
        </h1>
        <p className="mt-3 font-crt text-xl text-cocoa/90">
          Every stat earns its XP. Select one to reveal the projects built with
          it.
        </p>
      </header>

      <section id="skills">
        <SectionTitle>SKILLS</SectionTitle>
        <SkillQuestBoard skills={data.skills} projects={data.projects} />
      </section>

      <section id="experience" className="mt-16">
        <SectionTitle>EXPERIENCE</SectionTitle>
        {data.experiences.length === 0 ? (
          <Panel>
            <p className="font-crt text-xl text-cocoa/90">
              LEVEL HISTORY EMPTY — no quests logged yet.
            </p>
          </Panel>
        ) : (
          <div className="relative ml-4 pl-8 sm:ml-6">
            <div
              aria-hidden
              className="absolute bottom-3 left-0 top-3 w-4 border-[3px] border-bark bg-bark [background-image:repeating-linear-gradient(to_bottom,var(--color-pipe)_0,var(--color-pipe)_14px,transparent_14px,transparent_22px)]"
            />
            <ol className="space-y-6">
              {data.experiences.map((item, index) => (
                <li key={item.id} className="relative">
                  <span
                    aria-hidden
                    className={`${pipBase} ${index === 0 ? 'bg-gold' : 'bg-sand'}`}
                  />
                  <Panel>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-pixel text-lg leading-snug text-brown sm:text-xl">
                        {item.role}
                      </h3>
                      <p className="border-2 border-bark bg-bark px-2 py-1 font-crt text-lg leading-none text-gold">
                        {item.period}
                      </p>
                    </div>
                    <p className="mt-1 font-crt text-xl uppercase tracking-wide text-cocoa">
                      {item.company}
                    </p>
                    <p className="mt-2 font-crt text-xl text-cocoa/90">
                      {item.description}
                    </p>
                  </Panel>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  )
}
