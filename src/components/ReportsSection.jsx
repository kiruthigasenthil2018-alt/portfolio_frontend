import { useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { toneOf } from '../constants.js'
import { useUI } from '../ui.jsx'
import { downloadFile } from '../utils/download.js'
import { tilt } from '../utils/tilt.js'
import RobotBubble from './RobotBubble.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'
import useReveal from '../hooks/useReveal.js'

export default function ReportsSection() {
  const { robot, projects, reports_zip } = usePortfolio()
  const { openReport } = useUI()
  const [ref, visible] = useReveal()
  const [busy, setBusy] = useState(false)
  const withReports = projects.filter((p) => p.report_url)
  if (!withReports.length) return null

  const all = async () => { setBusy(true); await downloadFile(reports_zip, 'Kiruthiga-project-reports.zip'); setBusy(false) }

  return (
    <section id="reports" className="py-24 md:py-28 band tone-mint">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.reports} className="mb-6" />
        <SectionHead num="04" label="REPORTS" emoji="file-text" title="Every project, fully documented." className="mb-6" />
        <p className="text-ink/85 text-[16.5px] max-w-[62ch] mb-7">
          Each project has a PDF report — overview, features, architecture, my role and learnings. Preview it right here, or download it.
        </p>
        {reports_zip && (
          <button onClick={all} disabled={busy} className="btn btn-primary mb-10 disabled:opacity-60">
            {busy ? <><Icon name="loader" className="animate-spin" /> Preparing…</> : <><Icon name="package" /> Download all {withReports.length} reports (ZIP)</>}
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
          {withReports.map((p, i) => (
            <article key={p.slug} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className={`duo tilt p-6 mr-3 mb-3 flex flex-col gap-4 tone-${toneOf(p.accent, i)}`}>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0 w-[68px] h-[88px] rounded-lg bg-white border-2 bd-c shadow-[3px_3px_0_var(--sh1)] flex flex-col items-center justify-center">
                  <Icon name={p.emoji} size={30} className="t-c" fallback="file-text" />
                  <span className="absolute -bottom-2 -right-2 text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded" style={{ background: 'var(--acc)' }}>PDF</span>
                </div>
                <div>
                  <h3 className="font-head font-semibold text-[16.5px] text-ink leading-snug">{p.title}</h3>
                  <p className="font-mono text-[11.5px] font-semibold t-c mt-1">{p.category}</p>
                </div>
              </div>
              <p className="text-ink/80 text-[14.5px]">{p.short_description}</p>
              <div className="flex flex-wrap gap-2.5 mt-auto">
                <button onClick={() => openReport(p.slug)} className="btn btn-primary btn-sm !py-3"><Icon name="eye" size={16} /> Preview</button>
                <button onClick={() => downloadFile(p.report_url, `${p.slug}-project-report.pdf`)} className="btn btn-ghost btn-sm !py-3"><Icon name="download" size={16} /> Download</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
