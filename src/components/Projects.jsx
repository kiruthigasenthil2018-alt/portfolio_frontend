import { useMemo, useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { toneOf } from '../constants.js'
import { useUI } from '../ui.jsx'
import { downloadFile } from '../utils/download.js'
import { tilt } from '../utils/tilt.js'
import RobotBubble from './RobotBubble.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'
import useReveal from '../hooks/useReveal.js'

const kindOf = (p) => p.category.split('·')[0].trim()

export default function Projects() {
  const { robot, projects } = usePortfolio()
  const { openProject, openReport } = useUI()
  const [ref, visible] = useReveal()
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  const kinds = useMemo(() => ['All', ...new Set(projects.map(kindOf))], [projects])
  const shown = projects.filter((p) => {
    if (filter !== 'All' && kindOf(p) !== filter) return false
    const needle = q.trim().toLowerCase()
    return !needle || `${p.title} ${p.category} ${p.short_description} ${p.tech_stack.join(' ')}`.toLowerCase().includes(needle)
  })

  return (
    <section id="projects" className="py-24 md:py-28 band tone-lavender">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.projects} className="mb-6" />
        <SectionHead num="03" label="PROJECTS" emoji="rocket" title="Full stack projects, shipped." className="mb-8" />

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter projects">
            {kinds.map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={filter === k}
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all ${
                  filter === k ? 'text-white border-transparent bg-gradient-to-r from-[#6D3FD0] to-rose-500 shadow-[3px_3px_0_var(--sh1)]' : 'text-lav-700 bg-white border-lav-200 hover:border-rose-400 hover:text-rose-600'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <label className="relative ml-auto w-full sm:w-64">
            <span className="sr-only">Search projects or technologies</span>
            <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lav-600" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tech: React, Django…" className="field !pl-10 !py-2.5 !text-[14px] !rounded-full" />
          </label>
        </div>

        {shown.length === 0 && <p className="text-inkmuted font-semibold">No project matches “{q}”. Try “React” or “Django”.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {shown.map((p, i) => (
            <article
              key={p.slug}
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              className={`duo tilt overflow-hidden flex flex-col mr-3 mb-3 tone-${toneOf(p.accent, i)}`}
            >
              <button onClick={() => openProject(p.slug)} className="relative block aspect-[2.1/1] border-b-2 bd-c overflow-hidden bg-soft text-left" aria-label={`Open details for ${p.title}`}>
                <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]" />
                <span className="absolute top-3 left-3 w-11 h-11 rounded-2xl bg-white/95 border-2 bd-c flex items-center justify-center t-c shadow-[3px_3px_0_var(--sh1)]"><Icon name={p.emoji} size={22} fallback="briefcase" /></span>
              </button>

              <div className="p-7 flex flex-col gap-3 flex-1">
                <span className="font-mono text-[12px] font-semibold t-c">{p.category}</span>
                <h3 className="font-head text-lg font-semibold text-ink -mt-1.5">{p.title}</h3>
                <p className="text-ink/80 text-[15px]">{p.short_description}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {p.tech_stack.slice(0, 5).map((t) => (<span key={t} className="chip">{t}</span>))}
                  {p.tech_stack.length > 5 && <span className="chip">+{p.tech_stack.length - 5}</span>}
                </div>

                <div className="flex flex-wrap gap-3 mt-auto pt-3">
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><Icon name="globe" size={16} /> Live Demo</a>}
                  {p.backend_url && <a href={p.backend_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Icon name="server" size={16} /> {p.backend_label || 'Backend'}</a>}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t-2 bd-c">
                  <button onClick={() => openProject(p.slug)} className="btn btn-ghost btn-sm !py-2.5 !px-4"><Icon name="search" size={15} /> Details</button>
                  {p.report_url && (
                    <>
                      <button onClick={() => openReport(p.slug)} className="btn btn-ghost btn-sm !py-2.5 !px-4 tone-mint"><Icon name="eye" size={15} /> Preview report</button>
                      <button onClick={() => downloadFile(p.report_url, `${p.slug}-project-report.pdf`)} className="btn btn-ghost btn-sm !py-2.5 !px-4 tone-coral"><Icon name="download" size={15} /> PDF</button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
