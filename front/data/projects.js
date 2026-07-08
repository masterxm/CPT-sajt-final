export const STATUS_STYLE = {
  'Live':           { bg: 'rgba(90,122,90,0.12)',  border: 'rgba(90,122,90,0.28)',   text: '#5a7a5a', dot: '#5a7a5a' },
  'Beta':           { bg: 'rgba(122,82,48,0.12)',   border: 'rgba(122,82,48,0.28)',   text: '#9b7c5a', dot: '#7a5230' },
  'In Development': { bg: 'rgba(176,112,48,0.12)',  border: 'rgba(176,112,48,0.28)',  text: '#c08050', dot: '#b07040' },
  'Archived':       { bg: 'rgba(130,110,90,0.12)',  border: 'rgba(130,110,90,0.25)',  text: '#9b8060', dot: '#7a6040' },
}

// ─────────────────────────────────────────────────────────────────────────
// HOW TO ADD OR REPLACE A PROJECT
// Each entry needs:
//   title / desc / longDesc — desc shows on cards, longDesc is reserved for
//     detail pages
//   tags       — tech stack chips shown on the card
//   category   — 'Web App' | 'Desktop' | 'Mobile' | 'Automation' | ...
//   demoUrl    — link opened by the "Live Demo" button (internal route or
//     external URL), or null for "Demo coming soon"
//   status     — must be a key of STATUS_STYLE above
//   accent     — card accent color; visual — [from, to] thumbnail gradient
//   slug       — optional; gives the project its own /projects/<slug> page
//     (see front/pages/ProjectDetail.jsx)
// Entries marked PLACEHOLDER below are templates — overwrite them with real
// projects as they ship.
// ─────────────────────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 0,
    title: 'CPT Tajmer',
    desc: 'Pomodoro timer — 25 min focus, 5 min break, with a long break every 4 rounds.',
    longDesc: 'The Pomodoro productivity technique: focus for 25 minutes, rest for 5. Visual progress ring, audio cue, and automatic mode switching.',
    tags: ['React', 'Vite', 'Web Audio API'],
    category: 'Web App',
    demoUrl: '/apps/cpt-tajmer',
    repoUrl: null,
    status: 'Live',
    accent: '#a89aff',
    visual: ['#0e0c22', '#14103a'],
  },
  {
    id: 1,
    title: 'Relevant Serbian News',
    desc: 'Aggregates Serbian news RSS feeds and surfaces only AI & machine learning coverage.',
    longDesc: 'Live RSS aggregator across five Serbian news sources with real-time filtering for artificial intelligence and machine learning articles.',
    tags: ['React', 'RSS', 'Vite'],
    category: 'Web App',
    demoUrl: '/projects/alpha',
    repoUrl: null,
    status: 'Live',
    accent: '#8b6914',
    visual: ['#f0e8d8', '#e8dcc8'],
    slug: 'alpha',
  },
  {
    id: 2,
    title: 'Fridge',
    desc: 'AI-powered fridge inventory that maps your ingredients as a live graph and suggests recipes.',
    longDesc: 'Describe your fridge contents in plain language and the AI categorises everything into sweet and savory nodes, then suggests recipes — visualised as an Obsidian-style graph.',
    tags: ['React', 'Claude AI', 'SVG'],
    category: 'Web App',
    demoUrl: '/projects/beta',
    repoUrl: null,
    status: 'Beta',
    accent: '#7a5230',
    visual: ['#ece0d4', '#e4d8c8'],
    slug: 'beta',
  },
  // PLACEHOLDER — replace with a real project when ready
  {
    id: 3,
    title: 'Project Gamma',
    desc: 'Internal tooling or automation — describe it here.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['TypeScript', 'Electron', 'SQLite'],
    category: 'Desktop',
    demoUrl: null,
    repoUrl: null,
    status: 'In Development',
    accent: '#5a7a5a',
    visual: ['#dce8dc', '#d4e0d4'],
  },
  // PLACEHOLDER — replace with a real project when ready
  {
    id: 4,
    title: 'Project Delta',
    desc: 'A data or analytics tool — replace with real details.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['Vue', 'D3.js', 'BigQuery'],
    category: 'Web App',
    demoUrl: null,
    repoUrl: null,
    status: 'Live',
    accent: '#b07030',
    visual: ['#f0e4cc', '#e8dcc0'],
  },
  // PLACEHOLDER — replace with a real project when ready
  {
    id: 5,
    title: 'Project Epsilon',
    desc: 'A mobile or cross-platform app — describe it here.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['React Native', 'Expo', 'Supabase'],
    category: 'Mobile',
    demoUrl: null,
    repoUrl: null,
    status: 'Beta',
    accent: '#4a6a8a',
    visual: ['#d8e4f0', '#d0dce8'],
  },
  // PLACEHOLDER — replace with a real project when ready
  {
    id: 6,
    title: 'Project Zeta',
    desc: 'An automation or integration pipeline — add your description.',
    longDesc: 'Add a longer description here. Explain what the project does, who it is for, and what makes it interesting.',
    tags: ['Python', 'Celery', 'Docker'],
    category: 'Automation',
    demoUrl: null,
    repoUrl: null,
    status: 'Live',
    accent: '#9b5030',
    visual: ['#ece0d8', '#e4d8d0'],
  },
]
