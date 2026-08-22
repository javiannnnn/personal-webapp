import type { ReactNode } from 'react'

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`panel scanlines bg-beige p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={`mb-6 font-pixel text-2xl text-brown drop-shadow-[2px_2px_0_rgba(43,29,16,0.25)] sm:text-3xl ${className}`}
    >
      {children}
    </h2>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border-2 border-bark bg-sand px-2 py-0.5 font-crt text-sm leading-tight text-bark">
      {children}
    </span>
  )
}

/** Game-style XP bar: segmented track with green fill and level readout. */
export function XPBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div
      className="relative h-6 w-full overflow-hidden border-[3px] border-bark bg-bark"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-pipe transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
      {/* segment ticks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, transparent 0, transparent calc(10% - 2px), var(--color-bark) calc(10% - 2px), var(--color-bark) 10%)',
        }}
      />
    </div>
  )
}

export function PixelHeart() {
  return (
    <span
      aria-label="life"
      className="inline-block h-4 w-4 bg-life shadow-[inset_0_0_0_3px_var(--color-parchment)] [clip-path:polygon(50%_100%,100%_40%,85%_10%,50%_25%,15%_10%,0_40%)]"
    />
  )
}
