import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/app/admin/_components/LoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Insert Coin',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div
          aria-hidden
          className="float-bob mx-auto mb-6 flex h-14 w-14 items-center justify-center border-4 border-bark bg-gold font-pixel text-2xl text-bark shadow-pixel-sm"
        >
          ¢
        </div>

        <h1 className="text-center font-pixel text-3xl leading-tight text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-4xl">
          INSERT COIN
        </h1>
        <p className="blink mt-3 text-center font-pixel text-sm text-brown">
          ▼ PLAYER 1 READY ▼
        </p>

        <div className="panel scanlines mt-6 bg-beige p-5 sm:p-6">
          <LoginForm from={from} />
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 font-pixel text-sm text-brown transition-colors hover:text-mario"
        >
          <span aria-hidden>◄</span> BACK TO SITE
        </Link>
      </div>
    </div>
  )
}
