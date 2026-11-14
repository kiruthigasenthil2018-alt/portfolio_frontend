import {
  UserRound, Palette, Server, GitBranch, Languages, CircleDot, Building2, Globe, Zap, Atom, Smartphone, LayoutGrid,
  Terminal, Target, Plug, Database, Leaf, Monitor, Ruler, Send, Footprints, Pencil, SquareCheckBig, Star, Handshake,
  Receipt, Sprout, Bot, GraduationCap, Rocket, FileText, Mail, Map, Layers, Wrench, Briefcase, Eye, Download, Package,
  Search, Sun, Moon, X, Menu, ArrowUp, Volume2, Copy, Check, Loader, ContactRound, Github, Linkedin, MapPin, Sparkles,
  Heart, Keyboard, ExternalLink, Frown, Code2, Cog, Hammer, BookOpen, Cpu, Flag, Lightbulb, Mountain, Users, Settings2,
  FolderKanban, ScanSearch, Smile, MousePointerClick, Cloud, ListChecks, ShoppingBag, Boxes,
} from 'lucide-react'

// Professional line icons (lucide). Backend items store an icon NAME (chosen in the admin);
// old emoji values are still understood and mapped to the matching icon.
const ICONS = {
  'user': UserRound, palette: Palette, server: Server, 'git-branch': GitBranch, languages: Languages, status: CircleDot,
  building: Building2, globe: Globe, zap: Zap, atom: Atom, smartphone: Smartphone, grid: LayoutGrid, terminal: Terminal,
  target: Target, plug: Plug, database: Database, leaf: Leaf, monitor: Monitor, ruler: Ruler, send: Send,
  footprints: Footprints, pencil: Pencil, 'check-square': SquareCheckBig, star: Star, handshake: Handshake,
  receipt: Receipt, sprout: Sprout, bot: Bot, 'graduation-cap': GraduationCap, rocket: Rocket, 'file-text': FileText,
  mail: Mail, map: Map, layers: Layers, wrench: Wrench, briefcase: Briefcase, eye: Eye, download: Download,
  package: Package, search: Search, sun: Sun, moon: Moon, x: X, menu: Menu, 'arrow-up': ArrowUp, volume: Volume2,
  copy: Copy, check: Check, loader: Loader, contact: ContactRound, github: Github, linkedin: Linkedin, pin: MapPin,
  sparkles: Sparkles, heart: Heart, keyboard: Keyboard, external: ExternalLink, frown: Frown, code: Code2, cog: Cog,
  hammer: Hammer, book: BookOpen, cpu: Cpu, flag: Flag, lightbulb: Lightbulb, mountain: Mountain, users: Users,
  settings: Settings2, kanban: FolderKanban, inspect: ScanSearch, smile: Smile, click: MousePointerClick, cloud: Cloud,
  checklist: ListChecks, bag: ShoppingBag, boxes: Boxes,
}

const EMOJI = {
  '🙋': 'user', '🎨': 'palette', '⚙': 'cog', '🔀': 'git-branch', '🗣': 'languages', '🟢': 'status', '🏗': 'building',
  '🧰': 'wrench', '🌐': 'globe', '⚡': 'zap', '⚛': 'atom', '📱': 'smartphone', '🧱': 'grid', '🐍': 'terminal', '🎯': 'target',
  '🔌': 'plug', '🗄': 'database', '🍃': 'leaf', '💻': 'monitor', '📐': 'ruler', '📮': 'send', '🧾': 'receipt', '🌱': 'sprout',
  '🤖': 'bot', '👟': 'footprints', '✏': 'pencil', '✅': 'check-square', '🌟': 'star', '🥦': 'leaf', '🤝': 'handshake',
  '🚀': 'rocket', '📄': 'file-text', '📑': 'file-text', '💌': 'mail', '📧': 'mail', '🗺': 'map', '🛠': 'wrench',
  '💼': 'briefcase', '👁': 'eye', '⬇': 'download', '📦': 'package', '🔍': 'search', '🔎': 'search', '📍': 'pin',
  '✨': 'sparkles', '💜': 'heart', '⭐': 'star', '📇': 'contact', '🐙': 'github', '⌨': 'keyboard', '🏆': 'star',
}

const strip = (s) => String(s || '').replace(/[️‍]/g, '')

export function iconFor(name) {
  const key = strip(name).trim()
  if (ICONS[key]) return ICONS[key]
  const first = [...key][0]
  return ICONS[EMOJI[first]] || null
}

export default function Icon({ name, fallback = 'sparkles', size = 18, className = '', strokeWidth = 2 }) {
  const C = iconFor(name) || ICONS[fallback]
  return <C size={size} strokeWidth={strokeWidth} className={`shrink-0 ${className}`} aria-hidden="true" />
}

export const IconComponents = ICONS
