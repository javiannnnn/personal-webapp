'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  isAuthenticated,
  passwordMatches,
  SESSION_COOKIE,
  sessionToken,
} from './auth'
import { getPortfolio, savePortfolio } from './db'
import type { About, ExperienceItem, Project, Skill } from './types'

export type ActionResult = { ok: boolean; error?: string }

async function requireAuth(): Promise<ActionResult | null> {
  if (await isAuthenticated()) return null
  return { ok: false, error: 'Unauthorized' }
}

function revalidateAll() {
  revalidatePath('/', 'layout')
}

export async function login(
  formData: FormData,
): Promise<ActionResult | never> {
  const password = String(formData.get('password') ?? '')
  const from = String(formData.get('from') ?? '/admin')
  if (!passwordMatches(password)) {
    return { ok: false, error: 'Wrong password — GAME OVER. Try again.' }
  }
  const store = await cookies()
  store.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect(from.startsWith('/admin') ? from : '/admin')
}

export async function logout(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

export async function saveAbout(about: About): Promise<ActionResult> {
  const denied = await requireAuth()
  if (denied) return denied
  const portfolio = await getPortfolio()
  portfolio.about = about
  await savePortfolio(portfolio)
  revalidateAll()
  return { ok: true }
}

export async function saveProjects(projects: Project[]): Promise<ActionResult> {
  const denied = await requireAuth()
  if (denied) return denied
  const portfolio = await getPortfolio()
  portfolio.projects = projects
  await savePortfolio(portfolio)
  revalidateAll()
  return { ok: true }
}

export async function saveSkills(skills: Skill[]): Promise<ActionResult> {
  const denied = await requireAuth()
  if (denied) return denied
  const portfolio = await getPortfolio()
  portfolio.skills = skills
  await savePortfolio(portfolio)
  revalidateAll()
  return { ok: true }
}

export async function saveExperiences(
  experiences: ExperienceItem[],
): Promise<ActionResult> {
  const denied = await requireAuth()
  if (denied) return denied
  const portfolio = await getPortfolio()
  portfolio.experiences = experiences
  await savePortfolio(portfolio)
  revalidateAll()
  return { ok: true }
}
