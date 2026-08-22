'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Panel } from '@/components/ui'

type Destination = { keywords: string[]; label: string; href: string; hash?: string }

const DESTINATIONS: Destination[] = [
  { keywords: ['project', 'projects'], label: 'PROJECTS', href: '/projects' },
  { keywords: ['skill', 'skills'], label: 'SKILLS', href: '/skills', hash: 'skills' },
  {
    keywords: ['experience', 'experiences', 'job', 'jobs', 'work'],
    label: 'EXPERIENCE',
    href: '/skills',
    hash: 'experience',
  },
  { keywords: ['about', 'bio'], label: 'ABOUT ME', href: '/about' },
  { keywords: ['contact', 'email', 'mail'], label: 'CONTACT ME', href: '/contact' },
  { keywords: ['home', 'start'], label: 'HOME', href: '/' },
]

function resolve(raw: string): Destination | null {
  const q = raw.trim().toLowerCase()
  if (!q) return null
  return (
    DESTINATIONS.find((d) => d.keywords.includes(q)) ??
    DESTINATIONS.find((d) => d.keywords.some((k) => k.startsWith(q) || q.startsWith(k))) ??
    null
  )
}

export default function WarpConsole() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function warp(raw: string) {
    const dest = resolve(raw)
    if (!dest) {
      setError('GAME OVER — unknown warp code. Try one of the words below.')
      return
    }
    setError(null)
    setValue('')
    router.push(dest.hash ? `${dest.href}#${dest.hash}` : dest.href)
  }

  return (
    <Panel>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          warp(value)
        }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <label htmlFor="warp-input" className="sr-only">
          Type a destination
        </label>
        <input
          id="warp-input"
          type="text"
          autoFocus
          autoComplete="off"
          placeholder="TYPE A WORLD NAME…"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          className="flex-1 border-4 border-bark bg-parchment px-3 py-2 font-crt text-xl text-cocoa placeholder:text-cocoa/40 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="border-4 border-bark bg-mario px-5 py-2 font-pixel text-sm tracking-wider text-parchment shadow-pixel-sm transition-all duration-100 hover:bg-bark hover:text-gold active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          ► WARP
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 font-pixel text-sm text-mario">
          {error}
        </p>
      )}

      <p className="mt-6 font-crt text-xl text-cocoa/90">
        Accepted warp codes:
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {DESTINATIONS.map((dest) => (
          <li key={dest.label}>
            <button
              type="button"
              onClick={() => warp(dest.keywords[0])}
              className="border-[3px] border-bark bg-sand px-3 py-1.5 font-pixel text-xs tracking-wider text-bark shadow-pixel-sm transition-all duration-100 hover:bg-gold active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              {dest.label}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
