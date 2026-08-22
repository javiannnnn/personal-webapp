import type { Project } from '@/lib/types'
import Link from 'next/link'
import { Panel, Tag } from '@/components/ui'

const linkBase =
  'inline-block border-[3px] border-bark px-3 py-1.5 font-pixel text-xs tracking-wider shadow-pixel-sm transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Panel className="flex h-full flex-col gap-3 transition-all duration-150 hover:-translate-y-1 hover:border-brown! hover:shadow-[6px_6px_0_0_var(--color-cocoa)]!">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-pixel text-xl leading-snug text-brown">
          <Link
            href={`/projects/${project.id}`}
            className="transition-colors hover:text-mario focus-visible:text-mario focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h2>
        <span
          aria-hidden
          className="mt-1 h-3 w-3 shrink-0 bg-gold shadow-[inset_0_0_0_2px_var(--color-bark)]"
        />
      </div>
      <p className="font-crt text-xl text-cocoa">{project.description}</p>
      <ul className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-3 pt-2">
        <Link
          href={`/projects/${project.id}`}
          className={`${linkBase} bg-gold text-bark hover:bg-bark hover:text-gold`}
        >
          ► DETAILS
        </Link>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkBase} bg-mario text-parchment hover:bg-bark hover:text-gold`}
        >
          ► GITHUB
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} bg-pipe text-parchment hover:bg-bark hover:text-gold`}
          >
            ► LIVE DEMO
          </a>
        )}
      </div>
    </Panel>
  )
}
