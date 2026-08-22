import type { Metadata } from 'next'
import { getPortfolio } from '@/lib/db'
import { Panel } from '@/components/ui'
import ProjectCard from '@/components/projects/ProjectCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Shipped games, side quests and open-source repos from the Glen V. arcade.',
}

export default async function ProjectsPage() {
  const data = await getPortfolio()
  const stage = Math.max(1, data.projects.length)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-brown/40 pb-3 font-pixel text-xs tracking-widest text-brown sm:text-sm">
        <p>WORLD 1-{stage} · PROJECTS</p>
        <p>CARTS LOADED {String(data.projects.length).padStart(2, '0')}</p>
      </div>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-pixel text-4xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-5xl">
          PROJECTS
        </h1>
        <p className="font-crt text-xl text-cocoa/90">
          Pick a cartridge. Press START. Read the source.
          <span aria-hidden className="blink">
            &nbsp;_
          </span>
        </p>
      </header>

      {data.projects.length === 0 ? (
        <Panel className="text-center">
          <h2 className="font-pixel text-xl text-brown">NO CARTRIDGE INSERTED</h2>
          <p className="mt-2 font-crt text-xl text-cocoa/90">
            The shelf is empty for now — blow on a new cart and check back soon.
          </p>
        </Panel>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.projects.map((project) => (
            <li className="h-full" key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
