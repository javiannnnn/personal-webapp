import crypto from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'pw_admin_session'

/** Fallback password for local dev only — set ADMIN_PASSWORD in production. */
const FALLBACK_PASSWORD = 'press-start-1985'

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD
}

/** sha256("portfolio::" + password) — used as the session cookie value. */
export function sessionToken(): string {
  return crypto
    .createHash('sha256')
    .update(`portfolio::${adminPassword()}`)
    .digest('hex')
}

export function passwordMatches(input: string): boolean {
  const expected = Buffer.from(sessionToken())
  const given = Buffer.from(
    crypto.createHash('sha256').update(`portfolio::${input}`).digest('hex'),
  )
  if (expected.length !== given.length) return false
  return crypto.timingSafeEqual(expected, given)
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value === sessionToken()
}
