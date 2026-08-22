'use server'

import { login } from '@/lib/actions'

export type LoginState = { error?: string } | null

export async function loginAdapter(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const result = await login(formData)
  return result.ok ? prevState : { error: result.error ?? 'Wrong password' }
}
