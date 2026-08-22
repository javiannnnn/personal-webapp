'use client'

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type ComponentProps,
  type ReactNode,
} from 'react'

export const PIXEL_INPUT =
  'w-full border-4 border-bark bg-parchment px-2 py-1 font-crt text-lg leading-snug text-cocoa placeholder:text-cocoa/40 focus:bg-white focus:outline-none'

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 border-4 border-bark px-3 py-1.5 font-pixel text-sm text-bark shadow-pixel-sm transition-colors focus-visible:outline-none focus-visible:bg-coin active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60'

export type EditorProps<T> = {
  initial: T
  onDirtyChange?: (dirty: boolean) => void
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="font-pixel text-xs uppercase tracking-widest text-brown">
        {label}
      </span>
      {children}
    </label>
  )
}

export function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`${PIXEL_INPUT} ${className}`} {...props} />
}

export function TextArea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea className={`${PIXEL_INPUT} resize-y ${className}`} {...props} />
  )
}

export function PixelButton({
  tone = 'gold',
  className = '',
  type = 'button',
  ...props
}: ComponentProps<'button'> & { tone?: 'gold' | 'sand' }) {
  return (
    <button
      type={type}
      className={`${BUTTON_BASE} ${
        tone === 'gold' ? 'bg-gold hover:bg-coin' : 'bg-sand hover:bg-tan'
      } ${className}`}
      {...props}
    />
  )
}

export function DangerButton({
  className = '',
  type = 'button',
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={`${BUTTON_BASE} bg-mario text-parchment hover:bg-life ${className}`}
      {...props}
    />
  )
}

export function SaveBar({
  dirty,
  isPending,
  saved,
  error,
  onSave,
  label = 'SAVE',
}: {
  dirty: boolean
  isPending: boolean
  saved: boolean
  error?: string
  onSave: () => void
  label?: string
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-bark/30 pt-4">
      <PixelButton onClick={onSave} disabled={isPending || !dirty}>
        {isPending ? 'SAVING…' : label}
      </PixelButton>
      {dirty && !isPending && (
        <span aria-hidden className="blink font-pixel text-xs text-mario">
          ● UNSAVED
        </span>
      )}
      {saved && !dirty && !isPending && (
        <span role="status" className="font-pixel text-xs text-pipe">
          SAVED!
        </span>
      )}
      {error && (
        <span role="alert" className="font-crt text-lg text-mario">
          {error}
        </span>
      )}
    </div>
  )
}

export function useSave<T>(
  saveFn: (value: T) => Promise<{ ok: boolean; error?: string }>,
  onSuccess?: (value: T) => void
) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const save = useCallback(
    (value: T) => {
      setSaved(false)
      setError(undefined)
      startTransition(async () => {
        const result = await saveFn(value)
        if (result.ok) {
          onSuccess?.(value)
          setSaved(true)
        } else {
          setError(result.error ?? 'SAVE FAILED')
        }
      })
    },
    [saveFn, onSuccess]
  )

  return { isPending, saved, error, save }
}

export function useDirtySync(
  dirty: boolean,
  onDirtyChange?: (dirty: boolean) => void
) {
  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])
}
