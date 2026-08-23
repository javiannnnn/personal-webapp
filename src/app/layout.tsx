import type { Metadata } from 'next'
import { Pixelify_Sans, VT323 } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import MarioBackground from '@/components/MarioBackground'
import WarpBlock from '@/components/WarpBlock'

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: {
    default: 'Javian — Player One',
    template: '%s | Javian',
  },
  description:
    'Personal portfolio of Javian — full-stack developer, retro gamer, and coin collector.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${pixelify.variable} ${vt323.variable}`}>
      <body>
        <MarioBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
          <WarpBlock />
          <footer className="py-6 text-center font-crt text-lg text-cocoa/80">
            INSERT COIN TO CONTINUE
            <span className="blink">_</span>
          </footer>
        </div>
      </body>
    </html>
  )
}
