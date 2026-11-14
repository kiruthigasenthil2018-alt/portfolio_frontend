// Sections of the page: emoji + colour tone for each (tone classes live in index.css)
export const sections = [
  { id: 'about', label: 'About', emoji: 'user', tone: 'pink' },
  { id: 'skills', label: 'Skills', emoji: 'wrench', tone: 'sky' },
  { id: 'projects', label: 'Projects', emoji: 'rocket', tone: 'lavender' },
  { id: 'reports', label: 'Reports', emoji: 'file-text', tone: 'mint' },
  { id: 'journey', label: 'Journey', emoji: 'map', tone: 'amber' },
  { id: 'resume', label: 'Resume', emoji: 'file-text', tone: 'sky' },
  { id: 'contact', label: 'Contact', emoji: 'mail', tone: 'coral' },
]
export const navItems = sections
export const navIds = sections.map((s) => s.id)
export const TONES = ['lavender', 'pink', 'sky', 'mint', 'amber', 'coral']
export const toneOf = (name, i = 0) => (TONES.includes(name) ? name : TONES[i % TONES.length])
