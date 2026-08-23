'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Me' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills & Experience' },
  { href: '/contact', label: 'Contact Me' },
]

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/', label: 'View Site' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isAdmin = pathname.startsWith('/admin')
  const links = isAdmin ? ADMIN_LINKS : PUBLIC_LINKS

  return (
    <header className="sticky top-0 z-20 border-b-4 border-bark bg-brown shadow-[inset_0_2px_0_0_rgba(255,248,221,0.35)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={isAdmin ? '/admin' : '/'}
          className="font-pixel text-xl text-gold drop-shadow-[2px_2px_0_#2b1d10] sm:text-2xl"
        >
          <span className="text-mario">▚</span> JAVIAN.OS
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`menu-item ${active ? 'menu-item-active' : ''}`}
                >
                  {active && (
                    <span aria-hidden className="blink text-mario">
                      ►
                    </span>
                  )}
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="bevel-out bg-sand px-3 py-1 font-pixel text-sm text-bark active:shadow-[inset_2px_2px_0_0_rgba(43,29,16,0.6),inset_-2px_-2px_0_0_#fff8dd] md:hidden"
        >
          {open ? '× CLOSE' : '☰ MENU'}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="border-t-4 border-bark bg-beige md:hidden">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <li key={link.href} className="border-b-2 border-bark/30">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-5 py-3 font-pixel ${
                    active ? 'bg-gold text-bark' : 'text-brown'
                  }`}
                >
                  {active && (
                    <span aria-hidden className="blink text-mario">
                      ►
                    </span>
                  )}
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </header>
  )
}
