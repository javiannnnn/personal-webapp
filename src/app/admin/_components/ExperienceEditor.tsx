'use client'

import { useState } from 'react'
import { saveExperiences } from '@/lib/actions'
import type { ExperienceItem } from '@/lib/types'
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

export default function ExperienceEditor({
  initial,
  onDirtyChange,
}: EditorProps<ExperienceItem[]>) {
  const [drafts, setDrafts] = useState<ExperienceItem[]>(initial)
  const dirty = JSON.stringify(drafts) !== JSON.stringify(initial)
  useDirtySync(dirty, onDirtyChange)
  const { isPending, saved, error, save } = useSave(saveExperiences, (next) =>
    setDrafts(next)
  )

  function update(id: string, patch: Partial<Omit<ExperienceItem, 'id'>>) {
    setDrafts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function addExperience() {
    setDrafts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: '',
        company: '',
        period: '',
        description: '',
      },
    ])
  }

  function removeExperience(id: string) {
    setDrafts((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {drafts.map((item) => (
          <li
            key={item.id}
            className="border-4 border-bark bg-sand p-4 shadow-pixel-sm"
          >
            <div className="flex items-end justify-between gap-3">
              <h3 className="font-pixel text-sm text-brown">
                {item.role.trim() || 'NEW ENTRY'}
              </h3>
              <DangerButton
                onClick={() => removeExperience(item.id)}
                aria-label={`Delete experience ${item.role.trim() || 'entry'}`}
              >
                ✕
              </DangerButton>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field label="Role">
                <TextInput
                  value={item.role}
                  onChange={(e) => update(item.id, { role: e.target.value })}
                />
              </Field>
              <Field label="Company">
                <TextInput
                  value={item.company}
                  onChange={(e) =>
                    update(item.id, { company: e.target.value })
                  }
                />
              </Field>
              <Field label="Period">
                <TextInput
                  value={item.period}
                  onChange={(e) =>
                    update(item.id, { period: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <TextArea
                  rows={3}
                  value={item.description}
                  onChange={(e) =>
                    update(item.id, { description: e.target.value })
                  }
                />
              </Field>
            </div>
          </li>
        ))}
      </ul>

      {drafts.length === 0 && (
        <p className="font-crt text-lg text-cocoa/70">
          No experience entries yet — press the button below to spawn one.
        </p>
      )}

      <div className="mt-4">
        <PixelButton onClick={addExperience}>+ ADD EXPERIENCE</PixelButton>
      </div>

      <SaveBar
        dirty={dirty}
        isPending={isPending}
        saved={saved}
        error={error}
        label="SAVE EXPERIENCE"
        onSave={() =>
          save(
            drafts.map((item) => ({
              ...item,
              role: item.role.trim(),
              company: item.company.trim(),
              period: item.period.trim(),
            }))
          )
        }
      />
    </div>
  )
}
