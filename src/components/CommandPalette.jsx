import { useEffect, useMemo, useRef, useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { sections } from '../constants.js'
import { useUI } from '../ui.jsx'
import { downloadFile } from '../utils/download.js'
import { downloadVCard } from '../utils/vcard.js'
import Icon from './Icon.jsx'

// Ctrl/Cmd + K quick launcher: jump to sections, open projects / reports, run actions.
export default function CommandPalette({ onClose }) {
  const { profile, projects, reports_zip } = usePortfolio()
  const { openProject, openReport, openAssistant, goTo } = useUI()
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const input = useRef(null)

  const items = useMemo(() => {
    const list = [
      ...sections.map((s) => ({ group: 'Go to', emoji: s.emoji, label: s.label, run: () => goTo(s.id) })),
      ...projects.map((p) => ({ group: 'Projects', emoji: p.emoji || 'briefcase', label: p.title, hint: p.tech_stack.slice(0, 3).join(' · '), run: () => openProject(p.slug) })),
      ...projects.filter((p) => p.report_url).map((p) => ({ group: 'Reports', emoji: 'file-text', label: `Preview report — ${p.title}`, run: () => openReport(p.slug) })),
      ...(reports_zip ? [{ group: 'Actions', emoji: 'package', label: 'Download all reports (ZIP)', run: () => downloadFile(reports_zip, 'Kiruthiga-project-reports.zip') }] : []),
      ...(profile.resume_url ? [{ group: 'Actions', emoji: 'download', label: 'Download resume (PDF)', run: () => downloadFile(profile.resume_url, 'Kiruthiga_V_Resume.pdf') }] : []),
      { group: 'Actions', emoji: 'contact', label: 'Save my contact (.vcf)', run: () => downloadVCard(profile) },
      { group: 'Actions', emoji: 'bot', label: 'Ask about Kiruthiga', run: () => openAssistant() },
      { group: 'Actions', emoji: 'github', label: 'Open GitHub', run: () => window.open(profile.github_url, '_blank', 'noopener') },
      { group: 'Actions', emoji: 'linkedin', label: 'Open LinkedIn', run: () => window.open(profile.linkedin_url, '_blank', 'noopener') },
    ]
    const needle = q.trim().toLowerCase()
    return needle ? list.filter((i) => `${i.label} ${i.hint || ''} ${i.group}`.toLowerCase().includes(needle)) : list
  }, [q, projects, profile, reports_zip]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setCursor(0) }, [q])
  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow }
  }, [])

  const choose = (item) => { onClose(); setTimeout(item.run, 60) }
  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    else if (e.key === 'Enter' && items[cursor]) choose(items[cursor])
  }
  useEffect(() => { document.getElementById(`cmd-${cursor}`)?.scrollIntoView({ block: 'nearest' }) }, [cursor])

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-3 bg-[#12091f]/55 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Search the portfolio" className="duo pop w-full max-w-[560px] overflow-hidden" onKeyDown={onKey}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b-2 border-lav-200 bg-lav-50">
          <Icon name="search" size={18} className="text-lav-600" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sections, projects, reports, actions…" className="flex-1 bg-transparent outline-none text-[15.5px] text-ink placeholder:text-lav-700/60" aria-label="Search" />
          <span className="kbd">Esc</span>
        </div>
        <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
          {items.length === 0 && <li className="px-4 py-6 text-center text-ink/75 font-semibold">Nothing found for “{q}”</li>}
          {items.map((it, i) => (
            <li key={`${it.group}-${it.label}`} id={`cmd-${i}`} role="option" aria-selected={i === cursor}>
              {(i === 0 || items[i - 1].group !== it.group) && <div className="px-3 pt-2.5 pb-1 font-mono text-[11px] font-bold tracking-wide text-rose-600 uppercase">{it.group}</div>}
              <button onMouseEnter={() => setCursor(i)} onClick={() => choose(it)} className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14.5px] font-semibold transition ${i === cursor ? 'bg-gradient-to-r from-lav-100 to-rose-100 text-lav-700' : 'text-ink'}`}>
                <span className="w-7 flex justify-center t-c"><Icon name={it.emoji} size={19} /></span>
                <span className="flex-1 truncate">{it.label}</span>
                {it.hint && <span className="font-mono text-[11px] text-ink/60 hidden sm:block">{it.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
