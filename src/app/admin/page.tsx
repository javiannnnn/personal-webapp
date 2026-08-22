import type { Metadata } from 'next'
import AdminConsole from '@/app/admin/_components/AdminConsole'
import { getPortfolio } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Console',
}

export default async function AdminPage() {
  const data = await getPortfolio()
  return <AdminConsole data={data} />
}
