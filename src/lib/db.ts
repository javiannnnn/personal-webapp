import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { Portfolio } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json')

export const DEFAULT_PORTFOLIO: Portfolio = {
  about: {
    displayName: 'Glen V.',
    tagline: 'Full-stack developer · Player 1',
    bio: `Hi, I'm Glen — a software developer who grew up on 90s consoles and never got over the magic of a well-crafted game. These days I build web apps with the same care: snappy, reliable, and fun to use.\n\nWhen I'm not shipping code you'll find me speedrunning side projects, collecting retro hardware, and chasing 100% completion on everything I do.`,
    funFacts: [
      'Beat Mario without losing a single life (once)',
      'Owns more keyboards than power-ups',
      'Believes every bug is just an undocumented feature',
    ],
  },
  skills: [
    { id: 'sk-typescript', name: 'TypeScript', level: 90 },
    { id: 'sk-react', name: 'React', level: 88 },
    { id: 'sk-nextjs', name: 'Next.js', level: 82 },
    { id: 'sk-node', name: 'Node.js', level: 80 },
    { id: 'sk-tailwind', name: 'Tailwind CSS', level: 85 },
    { id: 'sk-python', name: 'Python', level: 72 },
    { id: 'sk-sql', name: 'SQL / PostgreSQL', level: 74 },
    { id: 'sk-docker', name: 'Docker', level: 60 },
  ],
  projects: [
    {
      id: 'pr-retro-arcade',
      title: 'Retro Arcade Cabinet',
      description:
        'A browser-based arcade that emulates classic 8-bit games with CRT scanline shaders, online leaderboards, and couch co-op via WebSockets.',
      longDescription: `Retro Arcade Cabinet started as a weekend experiment: could a modern browser faithfully recreate the feeling of standing in front of a 1985 arcade machine?\n\nThe cabinet runs a custom emulation core with per-game timing profiles, and every title is wrapped in a CRT shader pipeline — scanlines, phosphor glow, and curvature — that can be toggled in real time. Online leaderboards are powered by WebSockets, so scores appear live while you play, and couch co-op sessions sync input state at 60Hz.\n\nThe hardest part was audio: emulated APU channels drift over long sessions, so I wrote a resampling layer that keeps music pitch-stable even when frames drop.`,
      techStack: ['TypeScript', 'Node.js', 'WebSockets'],
      githubUrl: 'https://github.com/username/retro-arcade',
    },
    {
      id: 'pr-questlog',
      title: 'QuestLog',
      description:
        'A gamified habit tracker where daily tasks become quests. Earns XP, levels up characters, and syncs across devices.',
      longDescription: `QuestLog turns boring routines into an RPG. Every habit is a quest with its own XP value; completing quests levels up a character you customize, and streaks unlock gear.\n\nUnder the hood it uses optimistic UI updates backed by PostgreSQL row-level security, offline-first caching so quests can be completed on the subway, and a scheduling engine that understands flexible habits ("3x per week" rather than rigid daily reminders).\n\nThe character progression math is tuned against real habit-formation research — rewards arrive on a variable schedule to keep players engaged without trivializing progress.`,
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
      githubUrl: 'https://github.com/username/questlog',
    },
    {
      id: 'pr-pixel-forge',
      title: 'Pixel Forge',
      description:
        'A sprite editor for making 16x16 pixel art with onion-skinning, palette locking, and one-click export to sprite sheets.',
      longDescription: `Pixel Forge is what happens when a developer misses Deluxe Paint. It's a browser sprite editor built around strict pixel grids (8x8 up to 64x64), with tools that respect the medium: pencil with 1px precision, dithering brushes, palette locking, and symmetry modes.\n\nOnion-skinning lets animators see adjacent frames ghosted while they draw, and the timeline supports sub-frame timing for retro-style animation. Export handles sprite sheets, individual PNGs, and CSS box-shadow snippets.\n\nEverything renders to canvas at integer zoom levels so pixels always stay crisp.`,
      techStack: ['React', 'Tailwind CSS'],
      githubUrl: 'https://github.com/username/pixel-forge',
    },
    {
      id: 'pr-savepoint-api',
      title: 'SavePoint API',
      description:
        'A REST API for cataloguing game collections — box art scraping, playtime stats, and lending history. Fully dockerized.',
      longDescription: `SavePoint answers one question: who borrowed my copy of Chrono Trigger, and for how long now?\n\nThe API catalogues games with automatic metadata and box-art scraping, tracks playtime stats imported from multiple sources, and manages a lending history with friendly overdue nudges. Everything runs in Docker Compose — Postgres, a background worker for scrapes, and the API itself.\n\nIt began as a Python FastAPI exercise and grew into the backbone of my physical collection: roughly 300 carts and discs catalogued and actually accounted for.`,
      techStack: ['Python', 'Docker', 'SQL / PostgreSQL'],
      githubUrl: 'https://github.com/username/savepoint-api',
    },
    {
      id: 'pr-cartridge-db',
      title: 'Cartridge DB',
      description:
        'A searchable database of retro cartridges with price tracking charts and collection value estimates.',
      longDescription: `Cartridge DB indexes thousands of retro titles across a dozen consoles with regional variants, then tracks completed-sale prices over time so you can watch your collection's value curve like a stock portfolio.\n\nSearch is typo-tolerant and understands regional naming (it knows "Final Fantasy VI" and "Final Fantasy III" are related but different carts). Price charts render server-side to keep mobile fast, and collection estimates update nightly via scheduled jobs.\n\nThis was my deep-dive project into search relevance tuning and incremental data pipelines.`,
      techStack: ['Next.js', 'Node.js'],
      githubUrl: 'https://github.com/username/cartridge-db',
    },
  ],
  experiences: [
    {
      id: 'ex-current',
      role: 'Senior Full-Stack Developer',
      company: 'PixelWorks Studio',
      period: '2022 — Present',
      description:
        'Leading development of client web platforms. Cut page load times by 45% and mentor a squad of three junior devs.',
    },
    {
      id: 'ex-mid',
      role: 'Full-Stack Developer',
      company: 'Cloudpipe Software',
      period: '2019 — 2022',
      description:
        'Built and maintained SaaS dashboards used by 20k+ users. Owned the migration from REST to typed API clients.',
    },
    {
      id: 'ex-junior',
      role: 'Junior Web Developer',
      company: 'Bright Byte Agency',
      period: '2017 — 2019',
      description:
        'Shipped marketing sites and internal tools. First player to complete the agency onboarding quest in record time.',
    },
  ],
}

export async function getPortfolio(): Promise<Portfolio> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<Portfolio>
    return {
      about: parsed.about ?? DEFAULT_PORTFOLIO.about,
      projects: parsed.projects ?? [],
      skills: parsed.skills ?? [],
      experiences: parsed.experiences ?? [],
    }
  } catch {
    // Missing or corrupt file: fall back to seed data.
    return DEFAULT_PORTFOLIO
  }
}

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(portfolio, null, 2), 'utf8')
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}
