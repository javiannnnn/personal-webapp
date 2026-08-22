import type { Metadata } from 'next'
import { Panel } from '@/components/ui'
import WarpConsole from '@/components/WarpConsole'

export const metadata: Metadata = {
  title: 'Warp Console',
  description: 'Type a world name to warp straight there.',
}

export default function WarpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-brown/40 pb-3 font-pixel text-xs tracking-widest text-brown sm:text-sm">
        <p>WARP ZONE · SECRET ROOM</p>
        <p>1 WAY OUT</p>
      </div>

      <h1 className="mb-2 font-pixel text-3xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-4xl">
        WARP CONSOLE
      </h1>
      <p className="mb-8 font-crt text-xl text-cocoa/90">
        Found the hidden question block! Type where you want to go — try
        &ldquo;projects&rdquo;, &ldquo;skills&rdquo; or
        &ldquo;experiences&rdquo;.
        <span aria-hidden className="blink">
          _
        </span>
      </p>

      <WarpConsole />

      <Panel className="mt-6 text-center">
        <p className="font-crt text-lg text-cocoa/80">
          TIP: this block also floats in the corner of every page.
        </p>
      </Panel>
    </div>
  )
}
