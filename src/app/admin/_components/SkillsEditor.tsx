'use client'

import { useState } from 'react'
import { saveSkills } from '@/lib/actions'
import type { Skill } from '@/lib/types'
import {
  DangerButton,
  Field,
  PixelButton,
  SaveBar,
  TextInput,
  useDirtySync,
  useSave,
  type EditorProps,
} from './ui-bits'

function clampLevel(level: number): number {
  return Math.max(0, Math.min(100, Math.round(level)))
}

export default function SkillsEditor({
  initial,
  onDirtyChange,
}: EditorProps<Skill[]>) {
  const [drafts, setDrafts] = useState<Skill[]>(initial)
  const dirty = JSON.stringify(drafts) !== JSON.stringify(initial)
  useDirtySync(dirty, onDirtyChange)
  const { isPending, saved, error, save } = useSave(saveSkills, (next) =>
    setDrafts(next)
  )

  function update(id: string, patch: Partial<Omit<Skill, 'id'>>) {
    setDrafts((prev) =>
      prev.map((skill) => (skill.id === id ? { ...skill, ...patch } : skill))
    )
  }

  function addSkill() {
    setDrafts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', level: 50 },
    ])
  }

  function removeSkill(id: string) {
    setDrafts((prev) => prev.filter((skill) => skill.id !== id))
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {drafts.map((skill) => {
          const level = clampLevel(skill.level)
          return (
            <li
              key={skill.id}
              className="border-4 border-bark bg-sand p-3 shadow-pixel-sm"
            >
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-48 flex-1">
                  <Field label="Name">
                    <TextInput
                      value={skill.name}
                      onChange={(e) =>
                        update(skill.id, { name: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <DangerButton
                  onClick={() => removeSkill(skill.id)}
                  aria-label={`Delete skill ${skill.name.trim() || 'unnamed'}`}
                >
                  ✕
                </DangerButton>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={level}
                  aria-label={`${skill.name.trim() || 'Skill'} level`}
                  onChange={(e) =>
                    update(skill.id, { level: Number(e.target.value) })
                  }
                  className="h-2 min-w-32 flex-1 accent-pipe"
                />
                <span className="w-14 text-right font-pixel text-sm text-brown">
                  LV.{level}
                </span>
                <div
                  aria-hidden
                  className="h-4 w-28 shrink-0 border-2 border-bark bg-parchment"
                >
                  <div className="h-full bg-pipe" style={{ width: `${level}%` }} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {drafts.length === 0 && (
        <p className="font-crt text-lg text-cocoa/70">
          No skills yet — press the button below to spawn one.
        </p>
      )}

      <div className="mt-4">
        <PixelButton onClick={addSkill}>+ ADD SKILL</PixelButton>
      </div>

      <SaveBar
        dirty={dirty}
        isPending={isPending}
        saved={saved}
        error={error}
        label="SAVE SKILLS"
        onSave={() =>
          save(
            drafts.map((skill) => ({
              ...skill,
              name: skill.name.trim(),
              level: clampLevel(skill.level),
            }))
          )
        }
      />
    </div>
  )
}
