'use client'

import { useActionState } from 'react'
import { loginAdapter } from '@/app/admin/_lib/login-actions'
import { TextInput } from './ui-bits'

export default function LoginForm({ from }: { from?: string }) {
  const [state, formAction, isPending] = useActionState(loginAdapter, null)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="from" value={from ?? '/admin'} />
      <label className="flex flex-col gap-1">
        <span className="font-pixel text-xs uppercase tracking-widest text-brown">
          Password
        </span>
        <TextInput
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>

      {state?.error && (
        <p
          role="alert"
          className="border-4 border-bark bg-cocoa px-3 py-2 text-center font-pixel text-sm text-mario shadow-pixel-sm"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="border-4 border-bark bg-gold px-4 py-2 font-pixel text-base text-bark shadow-pixel transition-colors hover:bg-coin focus-visible:bg-coin focus-visible:outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'CHECKING…' : '► PRESS START'}
      </button>
    </form>
  )
}
