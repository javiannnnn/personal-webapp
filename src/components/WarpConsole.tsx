'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
    <div className="relative border-4 border-[#123a22] bg-term-bg p-5 sm:p-6 shadow-[6px_6px_0_0_var(--color-smb-shadow)]">
      <div className="term relative">
        {/* Window chrome */}
        <div className="mb-5 flex items-center justify-between border-b border-term-dim pb-3">
          <span className="font-pixel text-[0.7rem] tracking-widest text-term-amber">
            JAVIAN.OS — WARP SHELL
          </span>
          <span className="flex gap-2" aria-hidden>
            <span className="h-2.5 w-2.5 bg-term-red shadow-[0_0_6px_var(--color-term-red)]" />
            <span className="h-2.5 w-2.5 bg-term-amber shadow-[0_0_6px_var(--color-term-amber)]" />
            <span className="h-2.5 w-2.5 bg-term-green shadow-[0_0_6px_var(--color-term-green)]" />
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            warp(value)
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="warp-input" className="sr-only">
            Type a destination
          </label>
          <div className="flex flex-1 items-center gap-2 border-2 border-term-dim bg-[#020503] px-3 focus-within:border-term-green">
            <span aria-hidden className="font-pixel text-lg text-term-green">
              &gt;
            </span>
            <input
              id="warp-input"
              type="text"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="TYPE A WORLD NAME…"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(null)
              }}
              className="w-full bg-transparent py-2 font-pixel text-lg tracking-wider text-term-green caret-term-green placeholder:text-term-green-dim focus:outline-none"
            />
            <span aria-hidden className="term-caret hidden sm:inline-block" />
          </div>
          <button
            type="submit"
            className="border-2 border-term-green bg-term-green/10 px-6 py-2 font-pixel text-base tracking-widest text-term-green shadow-[0_0_8px_rgba(59,255,110,0.35)] transition-all hover:bg-term-green hover:text-term-bg active:translate-y-[2px] active:shadow-none"
          >
            ▶ EXEC
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 font-pixel text-sm tracking-wide text-term-red">
            <span aria-hidden className="mr-2">✗</span>
            {error}
          </p>
        )}

        <p className="mt-6 font-pixel text-sm tracking-wider text-term-amber">
          &gt; ACCEPTED WARP CODES:
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {DESTINATIONS.map((dest) => (
            <li key={dest.label}>
              <button
                type="button"
                onClick={() => warp(dest.keywords[0])}
                className="border border-term-green-dim px-3 py-1.5 font-pixel text-xs tracking-widest text-term-green transition-colors hover:border-term-green hover:bg-term-green hover:text-term-bg focus-visible:outline-none focus-visible:border-term-green"
              >
                {dest.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
