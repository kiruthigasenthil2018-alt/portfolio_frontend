import { useState } from 'react'
import { sections, navIds } from '../constants.js'
import { usePortfolio } from '../context.jsx'
import { useUI, goTo as scrollTo } from '../ui.jsx'
import useActiveSection from '../hooks/useActiveSection.js'
import useTheme from '../hooks/useTheme.js'
import Icon from './Icon.jsx'

export default function Header() {
  const { profile } = usePortfolio()
  const { openPalette } = useUI()
  const [open, setOpen] = useState(false)
  const activeId = useActiveSection(navIds)
  const [theme, toggleTheme] = useTheme()

  const go = (id) => { scrollTo(id); setOpen(false) }

  const pill = (s) =>
    `inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-full text-[13.5px] font-bold transition-all hover:-translate-y-0.5 tone-${s.tone} ${
      activeId === s.id
        ? 'text-white shadow-[3px_3px_0_var(--sh1)]'
        : 't-c bg-soft hover:shadow-[3px_3px_0_var(--sh1)]'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b-2 border-lav-200">
      <nav className="max-w-[1320px] mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between gap-3" aria-label="Main">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-mono text-[15px] tracking-[0.12em] font-bold grad-text whitespace-nowrap">
          <span className="inline-flex items-center gap-2"><Icon name="sparkles" size={17} className="text-rose-500" /><span>{(profile?.name || 'Kiruthiga').toUpperCase()}</span></span>
        </button>
        <ul className="hidden lg:flex gap-2">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                className={pill(s)}
                style={activeId === s.id ? { background: 'var(--acc)' } : undefined}
                aria-current={activeId === s.id ? 'true' : undefined}
              >
                <Icon name={s.emoji} size={16} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
        {/* Tablet: emoji-only pills (label stays for screen readers) */}
        <ul className="hidden md:flex lg:hidden gap-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                aria-label={s.label}
                title={s.label}
                className={`${pill(s)} !px-2.5`}
                style={activeId === s.id ? { background: 'var(--acc)' } : undefined}
              >
                <Icon name={s.emoji} size={18} />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white border-2 border-lav-200 px-3 py-2 text-[13px] font-semibold text-lav-700 hover:border-rose-400 transition"
            aria-label="Open search (Ctrl K)"
          >
            <Icon name="search" size={16} /> <span className="hidden xl:inline">Search</span> <span className="kbd">Ctrl K</span>
          </button>
          <button onClick={openPalette} className="sm:hidden w-10 h-10 rounded-full bg-white border-2 border-lav-200 text-lg" aria-label="Search"><Icon name="search" size={18} className="mx-auto" /></button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white border-2 border-lav-200 text-lav-700 hover:border-rose-400 transition"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} className="mx-auto" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-10 h-10 rounded-full bg-lav-100 border-2 border-lav-200 text-lg"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Icon name={open ? 'x' : 'menu'} size={19} className="mx-auto" />
          </button>
        </div>
      </nav>
      {open && (
        <ul className="grid grid-cols-2 md:hidden gap-2.5 px-4 pb-5 bg-white/95 border-b-2 border-lav-200">
          {sections.map((s) => (
            <li key={s.id}>
              <button onClick={() => go(s.id)} className={`${pill(s)} w-full justify-center`} style={activeId === s.id ? { background: 'var(--acc)' } : undefined}>
                <Icon name={s.emoji} size={17} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
