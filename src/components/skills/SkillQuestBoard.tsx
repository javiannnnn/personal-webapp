'use client'

import { useState } from 'react'
import type { Project, Skill } from '@/lib/types'
import { Panel, Tag, XPBar } from '@/components/ui'

export default function SkillQuestBoard({
  skills,
  projects,
}: {
  skills: Skill[]
  projects: Project[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level)
  const selected = skills.find((skill) => skill.id === selectedId) ?? null
  const matches = selected
    ? projects.filter((project) => project.techStack.includes(selected.name))
    : []

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <p className="mb-3 font-pixel text-xs tracking-widest text-brown sm:text-sm">
          SELECT A STAT TO PULL UP ITS QUEST LOG
          <span aria-hidden className="blink">
            &nbsp;_
          </span>
        </p>
        <ul className="space-y-3">
          {sortedSkills.map((skill) => {
            const isSelected = skill.id === selectedId
            return (
              <li key={skill.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(isSelected ? null : skill.id)}
                  aria-pressed={isSelected}
                  className={`block w-full cursor-pointer border-[3px] p-3 text-left transition-all duration-150 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brown ${
                    isSelected
                      ? 'border-bark bg-gold shadow-pixel-sm'
                      : 'border-bark/50 bg-beige hover:border-bark hover:bg-sand'
                  }`}
                >
                  <span className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-pixel text-base text-brown sm:text-lg">
                      <span
                        aria-hidden
                        className={isSelected ? 'text-mario' : 'opacity-0'}
                      >
                        ►{' '}
                      </span>
                      {skill.name}
                    </span>
                    <span className="shrink-0 font-crt text-xl text-cocoa">
                      LV {skill.level}
                    </span>
                  </span>
                  <XPBar value={skill.level} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="lg:col-span-2">
        <div aria-live="polite" className="lg:sticky lg:top-24">
          <Panel className="min-h-48">
            <h3 className="mb-2 font-pixel text-lg text-brown">QUEST LOG</h3>
            {selected === null ? (
              <p className="font-crt text-xl text-cocoa/90">
                Highlight a stat to reveal the projects forged with it.
              </p>
            ) : matches.length === 0 ? (
              <p className="font-crt text-xl text-cocoa/90">
                NO QUEST FOUND — no projects yet with this skill.
              </p>
            ) : (
              <>
                <p className="mb-3 font-crt text-lg text-cocoa/80">
                  {selected.name} · {matches.length} quest
                  {matches.length === 1 ? '' : 's'} found
                </p>
                <ul className="space-y-3">
                  {matches.map((project) => (
                    <li
                      key={project.id}
                      className="border-[3px] border-bark bg-sand p-3 shadow-pixel-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-pixel text-sm leading-snug text-brown">
                          {project.title}
                        </h4>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border-[3px] border-bark bg-mario px-2 py-0.5 font-pixel text-xs shadow-pixel-sm transition-all duration-100 text-parchment hover:bg-bark hover:text-gold active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                        >
                          ► GITHUB
                        </a>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <li key={tech}>
                            <Tag>{tech}</Tag>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
