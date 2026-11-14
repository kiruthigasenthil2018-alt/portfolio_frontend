import { useEffect, useRef, useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { useUI } from '../ui.jsx'
import Icon from './Icon.jsx'

// A tiny "Ask about Kiruthiga" helper. It answers instantly from the portfolio's own content
// (keyword matching) — it is NOT a live AI model, and says so.
function answer(q, data, ui) {
  const t = q.toLowerCase()
  const { profile, projects, skill_groups, journey } = data
  const has = (...w) => w.some((x) => t.includes(x))
  const names = (list) => list.map((p) => `• ${p.title}`).join('\n')
  const proj = projects.find((p) => t.includes(p.slug.split('-')[0]) || t.includes(p.title.split(/[ —-]/)[0].toLowerCase()))

  if (proj) return { text: `${proj.title}\n${proj.short_description}\nTech: ${proj.tech_stack.join(', ')}`, actions: [{ icon: 'search', label: 'Open details', run: () => ui.openProject(proj.slug) }, ...(proj.report_url ? [{ icon: 'eye', label: 'Preview report', run: () => ui.openReport(proj.slug) }] : [])] }
  if (has('report', 'pdf')) return { text: `Every project has a PDF report you can preview or download (${projects.filter((p) => p.report_url).length} so far).`, actions: [{ icon: 'file-text', label: 'Go to reports', run: () => ui.goTo('reports') }] }
  if (has('project', 'built', 'work', 'portfolio')) return { text: `Projects:\n${names(projects)}`, actions: [{ icon: 'rocket', label: 'See projects', run: () => ui.goTo('projects') }] }
  if (has('skill', 'tech', 'stack', 'know', 'language', 'react', 'django', 'python')) return { text: skill_groups.map((g) => `${g.title}: ${g.items.map((i) => i.name).join(', ')}`).join('\n'), actions: [{ icon: 'wrench', label: 'See skills', run: () => ui.goTo('skills') }] }
  if (has('hire', 'job', 'role', 'open to', 'available', 'intern')) return { text: profile.contact_text, actions: [{ icon: 'mail', label: 'Contact her', run: () => ui.goTo('contact') }] }
  if (has('contact', 'email', 'mail', 'reach', 'message')) return { text: `You can email ${profile.email} or use the contact form — messages go straight to her inbox.`, actions: [{ icon: 'mail', label: 'Open contact form', run: () => ui.goTo('contact') }] }
  if (has('resume', 'cv')) return { text: 'Her resume is in the Resume section — preview it or download the PDF.', actions: [{ icon: 'file-text', label: 'Go to resume', run: () => ui.goTo('resume') }] }
  if (has('journey', 'story', 'background', 'civil', 'education', 'learn', 'course')) return { text: journey.map((s) => `${s.label}: ${s.title}`).join('\n'), actions: [{ icon: 'map', label: 'See journey', run: () => ui.goTo('journey') }] }
  if (has('who', 'about', 'yourself', 'kiruthiga')) return { text: profile.about_paragraphs[0], actions: [{ icon: 'user', label: 'About section', run: () => ui.goTo('about') }] }
  if (has('hi', 'hello', 'hey')) return { text: `Hi! I can tell you about ${profile.name}'s projects, skills, reports, journey or how to contact her.` }
  return { text: "I only know what's on this portfolio. Try asking about projects, skills, reports, her journey or contact." }
}

const SUGGESTIONS = ['What projects has she built?', 'Which skills does she have?', 'Can I read the project reports?', 'Is she open to roles?']

export default function Assistant({ open, onClose, onOpen }) {
  const data = usePortfolio()
  const ui = useUI()
  const [log, setLog] = useState([{ from: 'bot', text: `Hi! I'm a quick helper for ${data.profile.name}'s portfolio.\nI answer instantly from this site's content (I'm not a live AI).` }])
  const [q, setQ] = useState('')
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [log, open])

  const ask = (text) => {
    const v = text.trim()
    if (!v) return
    setLog((l) => [...l, { from: 'me', text: v }, { from: 'bot', ...answer(v, data, ui) }])
    setQ('')
  }

  if (!open) {
    return (
      <button onClick={onOpen} aria-label="Ask about Kiruthiga" className="fixed bottom-5 right-5 z-40 h-14 pl-4 pr-5 rounded-full bg-gradient-to-r from-[#6D3FD0] to-rose-500 text-white font-bold text-[14px] shadow-[4px_4px_0_var(--sh1)] hover:-translate-y-0.5 transition flex items-center gap-2">
        <Icon name="bot" size={24} className="bob" /> Ask me
      </button>
    )
  }
  return (
    <div role="dialog" aria-label="Ask about Kiruthiga" className="duo pop fixed bottom-4 right-4 z-[75] w-[calc(100vw-2rem)] max-w-[380px] h-[min(560px,80vh)] flex flex-col overflow-hidden tone-pink">
      <div className="flex items-center gap-3 px-4 py-3 bg-soft border-b-2 bd-c">
        <Icon name="bot" size={26} className="t-c" />
        <div className="mr-auto"><div className="font-head font-semibold text-ink text-[15px]">Ask about {data.profile.name}</div><div className="font-mono text-[11px] text-ink/70">instant answers · not a live AI</div></div>
        <button onClick={onClose} aria-label="Close assistant" className="w-9 h-9 rounded-full bg-white border-2 bd-c"><Icon name="x" size={17} className="mx-auto" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/70" aria-live="polite">
        {log.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex'}>
            <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] whitespace-pre-line font-medium ${m.from === 'me' ? 'bg-gradient-to-r from-[#6D3FD0] to-rose-500 text-white rounded-br-sm' : 'bg-white border-2 border-lav-200 text-ink rounded-bl-sm'}`}>
              {m.text}
              {m.actions && <div className="flex flex-wrap gap-2 mt-2.5">{m.actions.map((a) => (<button key={a.label} onClick={() => { onClose(); setTimeout(a.run, 80) }} className="chip !text-[12px] !font-bold hover:-translate-y-0.5 transition inline-flex items-center gap-1.5"><Icon name={a.icon} size={13} /> {a.label}</button>))}</div>}
            </div>
          </div>
        ))}
        {log.length === 1 && <div className="flex flex-wrap gap-2">{SUGGESTIONS.map((s) => (<button key={s} onClick={() => ask(s)} className="chip !text-[12px] !font-semibold !py-1.5">{s}</button>))}</div>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(q) }} className="flex gap-2 p-3 border-t-2 bd-c bg-soft">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about projects, skills…" aria-label="Your question" className="field !py-2.5 !text-[14px]" />
        <button className="btn btn-primary btn-sm !px-4" aria-label="Send"><Icon name="send" size={16} /></button>
      </form>
    </div>
  )
}
