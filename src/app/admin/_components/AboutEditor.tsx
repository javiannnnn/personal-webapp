'use client'

import { useState } from 'react'
import { saveAbout } from '@/lib/actions'
import type { About } from '@/lib/types'
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

function normalize(about: About): About {
  return {
    ...about,
    funFacts: about.funFacts.map((fact) => fact.trim()).filter(Boolean),
  }
}

export default function AboutEditor({ initial, onDirtyChange }: EditorProps<About>) {
  const [draft, setDraft] = useState<About>(initial)
  const [baseline, setBaseline] = useState<About>(initial)
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline)
  useDirtySync(dirty, onDirtyChange)
  const { isPending, saved, error, save } = useSave(saveAbout, (next) => {
    setBaseline(next)
    setDraft(next)
  })

  function set<K extends keyof About>(key: K, value: About[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function setFact(index: number, value: string) {
    setDraft((prev) => ({
      ...prev,
      funFacts: prev.funFacts.map((fact, i) => (i === index ? value : fact)),
    }))
  }

  function removeFact(index: number) {
    setDraft((prev) => ({
      ...prev,
      funFacts: prev.funFacts.filter((_, i) => i !== index),
    }))
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display Name">
          <TextInput
            value={draft.displayName}
            onChange={(e) => set('displayName', e.target.value)}
          />
        </Field>
        <Field label="Tagline">
          <TextInput
            value={draft.tagline}
            onChange={(e) => set('tagline', e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Bio">
          <TextArea
            rows={6}
            value={draft.bio}
            onChange={(e) => set('bio', e.target.value)}
          />
        </Field>
      </div>

      <fieldset className="mt-6 border-4 border-bark bg-sand p-4">
        <legend className="px-2 font-pixel text-sm text-brown">FUN FACTS</legend>
        <div className="flex flex-col gap-2">
          {draft.funFacts.map((fact, index) => (
            <div key={index} className="flex items-center gap-2">
              <TextInput
                value={fact}
                aria-label={`Fun fact ${index + 1}`}
                onChange={(e) => setFact(index, e.target.value)}
              />
              <DangerButton
                onClick={() => removeFact(index)}
                aria-label={`Remove fun fact ${index + 1}`}
              >
                ✕
              </DangerButton>
            </div>
          ))}
          {draft.funFacts.length === 0 && (
            <p className="font-crt text-lg text-cocoa/70">No facts yet.</p>
          )}
        </div>
        <PixelButton
          tone="sand"
          className="mt-3"
          onClick={() => set('funFacts', [...draft.funFacts, ''])}
        >
          + ADD FACT
        </PixelButton>
      </fieldset>

      <SaveBar
        dirty={dirty}
        isPending={isPending}
        saved={saved}
        error={error}
        label="SAVE ABOUT"
        onSave={() => save(normalize(draft))}
      />
    </div>
  )
}
