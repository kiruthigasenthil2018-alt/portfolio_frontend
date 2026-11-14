import { useEffect, useRef, useState } from 'react'
import { downloadFile } from '../utils/download.js'
import { renderPdfInto } from '../utils/pdf.js'
import { toneOf } from '../constants.js'
import Icon from './Icon.jsx'

// Full-screen preview of a project report PDF (rendered with pdf.js) + download button.
export default function ReportModal({ project: p, projects, onClose, onSwitch }) {
  const viewer = useRef(null)
  const closeRef = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | error
  const [pages, setPages] = useState(0)

  useEffect(() => {
    const previous = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    setState('loading')
    renderPdfInto(viewer.current, p.report_url, () => cancelled)
      .then((n) => { if (!cancelled) { setPages(n); setState('ready') } })
      .catch(() => { if (!cancelled) setState('error') })
    return () => { cancelled = true }
  }, [p.report_url])

  const others = projects.filter((x) => x.report_url)

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-2 md:p-6 bg-[#12091f]/55 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={`${p.title} project report`} className={`duo pop relative w-full max-w-[900px] h-[92vh] flex flex-col overflow-hidden tone-${toneOf(p.accent)}`}>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b-2 bd-c bg-soft">
          <span className="w-11 h-11 rounded-2xl bg-white border-2 bd-c flex items-center justify-center t-c"><Icon name={p.emoji} size={22} fallback="file-text" /></span>
          <div className="min-w-0 mr-auto">
            <h3 className="font-head font-semibold text-[16px] text-ink truncate">{p.title} — Project Report</h3>
            <p className="font-mono text-[11.5px] text-inkmuted">{state === 'ready' ? `${pages} page${pages === 1 ? '' : 's'} · PDF` : 'PDF preview'}</p>
          </div>
          <button onClick={() => downloadFile(p.report_url, `${p.slug}-project-report.pdf`)} className="btn btn-primary btn-sm"><Icon name="download" size={16} /> Download PDF</button>
          <button ref={closeRef} onClick={onClose} aria-label="Close preview" className="w-10 h-10 rounded-full bg-white border-2 bd-c text-lav-700 hover:text-rose-600"><Icon name="x" size={18} className="mx-auto" /></button>
        </div>

        {others.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 border-b bd-c bg-white/70" role="tablist" aria-label="Switch report">
            {others.map((x) => (
              <button key={x.slug} role="tab" aria-selected={x.slug === p.slug} onClick={() => onSwitch(x.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-bold border-2 transition ${x.slug === p.slug ? 'text-white border-transparent' : 'bg-white t-c bd-c hover:-translate-y-0.5'} tone-${toneOf(x.accent)}`}
                style={x.slug === p.slug ? { background: 'var(--acc)' } : undefined}>
                <Icon name={x.emoji} size={14} className="inline mr-1 -mt-0.5" fallback="file-text" />{x.title.split('—')[0].split(' - ')[0]}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex-1 overflow-y-auto p-3 md:p-5 bg-white/60">
          <div ref={viewer} />
          {state === 'loading' && <p className="absolute inset-0 flex items-center justify-center text-ink font-semibold animate-pulse"><Icon name="loader" className="animate-spin mr-2" /> Opening report…</p>}
          {state === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
              <p className="text-ink font-semibold">The preview couldn't load in this browser.</p>
              <button onClick={() => downloadFile(p.report_url, `${p.slug}-project-report.pdf`)} className="btn btn-primary btn-sm"><Icon name="download" size={16} /> Download the PDF instead</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
