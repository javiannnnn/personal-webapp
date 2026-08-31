import type { Metadata } from 'next'
import WarpConsole from '@/components/WarpConsole'

export const metadata: Metadata = {
  title: 'Warp Console',
  description: 'Type a world name to warp straight there.',
}

export default function WarpPage() {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-1 flex-col px-4 py-16">
      {/* Terminal header strip */}
      <div className="term relative mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-term-dim pb-3">
        <p className="font-pixel text-[0.7rem] tracking-widest text-term-green-dim">
          WARP ZONE · SECRET ROOM
        </p>
        <p className="font-pixel text-[0.7rem] tracking-widest text-term-amber">
          1 WAY OUT
        </p>
      </div>

      <div className="term relative">
        <h1 className="font-pixel text-3xl tracking-wide text-term-green drop-shadow-[0_0_12px_rgba(59,255,110,0.55)] sm:text-4xl">
          WARP CONSOLE
        </h1>

        {/* Boot-log style intro */}
        <div className="mt-6 space-y-1 font-pixel text-base leading-relaxed text-term-green-dim sm:text-lg">
          <p>
            <span aria-hidden className="text-term-green">&gt;</span> loading arcade
            routes…
            <span aria-hidden className="blink text-term-green">_</span>
          </p>
          <p className="text-term-green">
            &gt; secret &ldquo;?&rdquo; block opened. type where you want to go — try
            &ldquo;projects&rdquo;, &ldquo;skills&rdquo; or &ldquo;experiences&rdquo;.
            <span aria-hidden className="term-caret" />
          </p>
        </div>

        <div className="mt-8">
          <WarpConsole />
        </div>

        <p className="mt-8 border-t border-term-dim pt-4 font-pixel text-sm text-term-green-dim">
          <span aria-hidden className="text-term-green">&gt;</span> tip: this block also
          floats in the corner of every page.
        </p>
      </div>
    </div>
  )
}
