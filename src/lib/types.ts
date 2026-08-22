export type Project = {
  id: string
  title: string
  description: string
  /** Longer write-up shown on the project's detail page */
  longDescription?: string
  techStack: string[]
  githubUrl: string
  liveUrl?: string
}

export type Skill = {
  id: string
  name: string
  /** 0-100, rendered as an XP-style progress bar */
  level: number
}

export type ExperienceItem = {
  id: string
  role: string
  company: string
  period: string
  description: string
}

export type About = {
  displayName: string
  tagline: string
  bio: string
  funFacts: string[]
}

export type Portfolio = {
  about: About
  projects: Project[]
  skills: Skill[]
  experiences: ExperienceItem[]
}
