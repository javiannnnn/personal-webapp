import type { Metadata } from 'next'
import { getPortfolio } from '@/lib/db'
import { Panel, SectionTitle } from '@/components/ui'
import ContactForm from '@/components/contact/ContactForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
}

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'you@example.com'

export default async function ContactPage() {
  const data = await getPortfolio()

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 px-4 py-12 sm:py-16">
      <header className="text-center">
        <h1 className="font-pixel text-3xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-4xl">
          SEND A MESSAGE
        </h1>
        <p className="mt-3 font-crt text-xl text-cocoa sm:text-2xl">
          Drop a line to {data.about.displayName} — replies sent within one
          continue screen.
        </p>
      </header>

      <Panel>
        <SectionTitle>NEW MESSAGE</SectionTitle>
        <ContactForm email={CONTACT_EMAIL} />
      </Panel>

      <div className="text-center font-crt text-lg text-cocoa/90">
        Direct line:{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-bold underline decoration-dotted decoration-brown underline-offset-4 hover:text-brown"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-1 text-base text-cocoa/70">
          Opens your mail app — nothing is stored on this server.
        </p>
      </div>
    </div>
  )
}
