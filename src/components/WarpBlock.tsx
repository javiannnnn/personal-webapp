'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function WarpBlock() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/warp')) {
    return null
  }

  return (
    <Link
      href="/warp"
      aria-label="Open the warp console"
      className="float-bob fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center border-4 border-bark bg-gold font-pixel text-2xl text-bark shadow-pixel transition-colors hover:bg-coin active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
    >
      ?
    </Link>
  )
}
