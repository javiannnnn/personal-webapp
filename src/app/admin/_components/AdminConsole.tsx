'use client'

import { useCallback, useState } from 'react'
import AboutEditor from './AboutEditor'
import ExperienceEditor from './ExperienceEditor'
import ProjectsEditor from './ProjectsEditor'
import SkillsEditor from './SkillsEditor'
import { DangerButton } from './ui-bits'
import { logout } from '@/lib/actions'
import type { Portfolio } from '@/lib/types'

const TABS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'experience', label: 'EXPERIENCE' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminConsole({ data }: { data: Portfolio }) {
  const [tab, setTab] = useState<TabId>('about')
  const [dirtyTabs, setDirtyTabs] = useState<Record<TabId, boolean>>({
    about: false,
    projects: false,
    skills: false,
    experience: false,
  })

  const setFlag = useCallback(
    (id: TabId, dirty: boolean) =>
      setDirtyTabs((prev) =>
        prev[id] === dirty ? prev : { ...prev, [id]: dirty }
      ),
    []
  )

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-pixel text-3xl leading-tight text-brown drop-shadow-[2px_2px_0_rgba(43,29,16,0.25)] sm:text-4xl">
            <span aria-hidden className="text-mario">▚</span> ADMIN CONSOLE
          </h1>
          <p className="mt-1 font-crt text-lg text-cocoa/80">
            Player 1 control panel
          </p>
        </div>
        <form action={logout}>
          <DangerButton type="submit">LOG OUT</DangerButton>
        </form>
      </header>

      <div
        role="group"
        aria-label="Admin sections"
        className="mb-4 flex flex-wrap gap-2"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-4 border-bark px-3 py-2 font-pixel text-sm shadow-pixel-sm transition-colors focus-visible:outline-none focus-visible:bg-coin ${
                active ? 'bg-gold text-bark' : 'bg-sand text-brown hover:bg-tan'
              }`}
            >
              {active && (
                <span aria-hidden className="blink text-mario">
                  ►
                </span>
              )}
              {label}
              {dirtyTabs[id] && (
                <span aria-hidden className="text-mario">
                  ●
                </span>
              )}
            </button>
          )
        })}
      </div>

      <section className="panel scanlines bg-beige p-4 sm:p-6">
        <div hidden={tab !== 'about'}>
          <AboutEditor
            initial={data.about}
            onDirtyChange={(dirty) => setFlag('about', dirty)}
          />
        </div>
        <div hidden={tab !== 'projects'}>
          <ProjectsEditor
            initial={data.projects}
            onDirtyChange={(dirty) => setFlag('projects', dirty)}
          />
        </div>
        <div hidden={tab !== 'skills'}>
          <SkillsEditor
            initial={data.skills}
            onDirtyChange={(dirty) => setFlag('skills', dirty)}
          />
        </div>
        <div hidden={tab !== 'experience'}>
          <ExperienceEditor
            initial={data.experiences}
            onDirtyChange={(dirty) => setFlag('experience', dirty)}
          />
        </div>
      </section>

      <p className="blink mt-6 text-center font-pixel text-xs text-brown">
        ▼ CHANGES GO LIVE SITE-WIDE AFTER SAVE ▼
      </p>
    </div>
  )
}
