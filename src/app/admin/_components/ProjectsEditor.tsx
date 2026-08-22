'use client'

import { useState } from 'react'
import { saveProjects } from '@/lib/actions'
import type { Project } from '@/lib/types'
import {
  DangerButton,
  Field,
  PixelButton,
  SaveBar,
  TextArea,
  TextInput,
  useDirtySync,
  useSave,
  type EditorProps,
} from './ui-bits'

type DraftProject = {
  id: string
  title: string
  description: string
  longDescriptionText: string
  techStackText: string
  githubUrl: string
  liveUrlText: string
}

function toDraft(project: Project): DraftProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    longDescriptionText: project.longDescription ?? '',
    techStackText: project.techStack.join(', '),
    githubUrl: project.githubUrl,
    liveUrlText: project.liveUrl ?? '',
  }
}

function toProject(draft: DraftProject): Project {
  const liveUrl = draft.liveUrlText.trim()
  const longDescription = draft.longDescriptionText.trim()
  return {
    id: draft.id,
    title: draft.title.trim(),
    description: draft.description,
    ...(longDescription ? { longDescription } : {}),
    techStack: draft.techStackText
      .split(',')
      .map((tech) => tech.trim())
      .filter(Boolean),
    githubUrl: draft.githubUrl.trim(),
    ...(liveUrl ? { liveUrl } : {}),
  }
}

type Patch = Partial<Omit<DraftProject, 'id'>>

export default function ProjectsEditor({
  initial,
  onDirtyChange,
}: EditorProps<Project[]>) {
  const [baseline, setBaseline] = useState<DraftProject[]>(
    () => initial.map(toDraft)
  )
  const [drafts, setDrafts] = useState<DraftProject[]>(baseline)
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(initial.slice(0, 1).map((project) => project.id))
  )
  const dirty = JSON.stringify(drafts) !== JSON.stringify(baseline)
  useDirtySync(dirty, onDirtyChange)
  const { isPending, saved, error, save } = useSave(saveProjects, (next) => {
    const normalized = next.map(toDraft)
    setBaseline(normalized)
    setDrafts(normalized)
  })

  function update(id: string, patch: Patch) {
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft))
    )
  }

  function addProject() {
    const id = crypto.randomUUID()
    setDrafts((prev) => [
      ...prev,
      {
        id,
        title: '',
        description: '',
        longDescriptionText: '',
        techStackText: '',
        githubUrl: '',
        liveUrlText: '',
      },
    ])
    setOpenIds((prev) => new Set(prev).add(id))
  }

  function removeProject(id: string) {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id))
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {drafts.map((draft) => {
          const open = openIds.has(draft.id)
          const label = draft.title.trim() || 'UNTITLED PROJECT'
          return (
            <li
              key={draft.id}
              className="border-4 border-bark bg-sand shadow-pixel-sm"
            >
              <div className="flex items-stretch border-b-4 border-bark">
                <button
                  type="button"
                  onClick={() => toggleOpen(draft.id)}
                  aria-expanded={open}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-left font-pixel text-sm text-bark transition-colors hover:bg-tan focus-visible:bg-tan focus-visible:outline-none"
                >
                  <span aria-hidden className="text-mario">
                    {open ? '▼' : '►'}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
                <DangerButton
                  onClick={() => removeProject(draft.id)}
                  aria-label={`Delete project ${label}`}
                >
                  ✕
                </DangerButton>
              </div>

              {open && (
                <div className="flex flex-col gap-4 p-4">
                  <Field label="Title">
                    <TextInput
                      value={draft.title}
                      onChange={(e) =>
                        update(draft.id, { title: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Description">
                    <TextArea
                      rows={4}
                      value={draft.description}
                      onChange={(e) =>
                        update(draft.id, { description: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Long Description (detail page — blank lines split paragraphs)">
                    <TextArea
                      rows={8}
                      value={draft.longDescriptionText}
                      onChange={(e) =>
                        update(draft.id, {
                          longDescriptionText: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Tech Stack (comma separated)">
                    <TextInput
                      value={draft.techStackText}
                      onChange={(e) =>
                        update(draft.id, { techStackText: e.target.value })
                      }
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="GitHub URL">
                      <TextInput
                        value={draft.githubUrl}
                        onChange={(e) =>
                          update(draft.id, { githubUrl: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Live URL (optional)">
                      <TextInput
                        value={draft.liveUrlText}
                        onChange={(e) =>
                          update(draft.id, { liveUrlText: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {drafts.length === 0 && (
        <p className="font-crt text-lg text-cocoa/70">
          No projects yet — press the button below to spawn one.
        </p>
      )}

      <div className="mt-4">
        <PixelButton onClick={addProject}>+ ADD NEW PROJECT</PixelButton>
      </div>

      <SaveBar
        dirty={dirty}
        isPending={isPending}
        saved={saved}
        error={error}
        label="SAVE PROJECTS"
        onSave={() => save(drafts.map(toProject))}
      />
    </div>
  )
}
