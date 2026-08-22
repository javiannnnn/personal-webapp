import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPortfolio } from '@/lib/db'
import { Panel, SectionTitle, Tag, XPBar } from '@/components/ui'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const data = await getPortfolio()
  const project = data.projects.find((p) => p.id === id)
  return {
    title: project ? project.title : 'Project Not Found',
    description: project?.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const data = await getPortfolio()
  const index = data.projects.findIndex((p) => p.id === id)
  if (index === -1) notFound()

  const project = data.projects[index]
  const stage = String(index + 1).padStart(2, '0')
  const relatedSkills = data.skills.filter((skill) =>
    project.techStack.includes(skill.name),
  )
  const otherProjects = data.projects.filter((p) => p.id !== project.id)
  const paragraphs = (project.longDescription ?? project.description).split(
    /\n\n+/,
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/projects"
        className="inline-block font-pixel text-sm text-brown transition-colors hover:text-mario"
      >
        ◄ ALL PROJECTS
      </Link>

      <div className="mb-6 mt-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-brown/40 pb-3 font-pixel text-xs tracking-widest text-brown sm:text-sm">
        <p>WORLD 1-{stage} · {project.title.toUpperCase()}</p>
        <p>STAGE SELECT</p>
      </div>

      <header className="mb-8">
        <h1 className="font-pixel text-3xl text-brown drop-shadow-[3px_3px_0_rgba(43,29,16,0.25)] sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-3 font-crt text-xl text-cocoa/90">
          {project.description}
        </p>
      </header>

      <Panel className="mb-10">
        <article className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="font-crt text-xl leading-relaxed text-cocoa">
              {paragraph}
            </p>
          ))}
        </article>

        <ul className="mt-6 flex flex-wrap gap-2 border-t-2 border-brown/30 pt-5">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-[3px] border-bark bg-mario px-4 py-2 font-pixel text-xs tracking-wider text-parchment shadow-pixel-sm transition-all duration-100 hover:bg-bark hover:text-gold active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            ► VIEW SOURCE ON GITHUB
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-[3px] border-bark bg-pipe px-4 py-2 font-pixel text-xs tracking-wider text-parchment shadow-pixel-sm transition-all duration-100 hover:bg-bark hover:text-gold active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              ► LIVE DEMO
            </a>
          )}
        </div>
      </Panel>

      {relatedSkills.length > 0 && (
        <section className="mb-10">
          <SectionTitle>POWERS USED</SectionTitle>
          <Panel className="flex flex-col gap-4">
            {relatedSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-4">
                <span className="w-40 shrink-0 font-pixel text-sm text-brown sm:w-56">
                  {skill.name}
                </span>
                <XPBar value={skill.level} />
                <span className="font-crt text-lg text-cocoa/90">
                  LV {skill.level}
                </span>
              </div>
            ))}
          </Panel>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section>
          <SectionTitle>NEXT LEVEL</SectionTitle>
          <Panel>
            <ul className="grid gap-3 sm:grid-cols-2">
              {otherProjects.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/projects/${other.id}`}
                    className="block border-[3px] border-bark bg-parchment px-3 py-2 transition-colors hover:bg-gold focus-visible:bg-gold focus-visible:outline-none"
                  >
                    <span aria-hidden className="mr-2 text-mario">
                      ►
                    </span>
                    <span className="font-pixel text-sm text-bark">
                      {other.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      )}
    </div>
  )
}
