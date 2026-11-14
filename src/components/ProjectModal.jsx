import { useEffect, useRef, useState } from 'react'
import { downloadFile } from '../utils/download.js'
import { toneOf } from '../constants.js'
import { useUI } from '../ui.jsx'
import Icon from './Icon.jsx'

function Block({ title, children }) {
  return (
    <section className="mb-6">
      <h4 className="font-head text-[15px] font-semibold t-c mb-2 flex items-center gap-2">{title}</h4>
      {children}
    </section>
  )
}

const List = ({ items }) => (
  <ul className="space-y-1.5 text-[14.5px] text-ink/80">
    {items.map((i) => (
      <li key={i} className="flex gap-2.5">
        <Icon name="check" size={15} className="t-c mt-[3px]" />
        <span>{i}</span>
      </li>
    ))}
  </ul>
)

export default function ProjectModal({ project: p, onClose }) {
  const { openReport } = useUI()
  const [shot, setShot] = useState(0)
  const closeRef = useRef(null)

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

  const gallery = p.gallery?.length ? p.gallery : [{ image: p.image, caption: '' }]
  const current = gallery[Math.min(shot, gallery.length - 1)]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start md:items-center justify-center p-3 md:p-8 bg-[#12091f]/55 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${p.title} details`}
        className={`duo relative w-full max-w-[980px] my-auto overflow-hidden tone-${toneOf(p.accent)}`}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white border border-lav-200 text-lav-700 hover:text-rose-600 hover:border-rose-400 text-xl leading-none"
        >
          <Icon name="x" size={18} className="mx-auto" />
        </button>

        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <div className="bg-soft p-5 md:p-6 flex flex-col gap-3">
            <div className="rounded-xl overflow-hidden border border-lav-200 bg-white flex items-center justify-center">
              <img src={current.image} alt={`${p.title} — ${current.caption || 'screenshot'}`} className="w-full h-auto max-h-[420px] object-contain" />
            </div>
            {current.caption && <p className="font-mono text-[12px] text-lav-700 text-center">{current.caption}</p>}
            {gallery.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {gallery.map((g, i) => (
                  <button
                    key={g.image}
                    onClick={() => setShot(i)}
                    aria-label={`Show ${g.caption || `screenshot ${i + 1}`}`}
                    aria-pressed={i === shot}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 ${i === shot ? 'border-rose-500' : 'border-lav-200'}`}
                  >
                    <img src={g.image} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"><Icon name="globe" size={16} /> Live Demo</a>}
              {p.backend_url && <a href={p.backend_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Icon name="server" size={16} /> {p.backend_label || 'Backend'}</a>}
              {p.repo_url && <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Icon name="github" size={16} /> Source</a>}
              {p.report_url && (
                <>
                  <button onClick={() => { onClose(); openReport(p.slug) }} className="btn btn-ghost btn-sm tone-mint"><Icon name="eye" size={16} /> Preview report</button>
                  <button onClick={() => downloadFile(p.report_url, `${p.slug}-project-report.pdf`)} className="btn btn-ghost btn-sm tone-coral"><Icon name="download" size={16} /> Download</button>
                </>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 md:max-h-[80vh] overflow-y-auto">
            <span className="font-mono text-[12px] font-semibold t-c">{p.category}</span>
            <h3 className="font-head text-2xl font-semibold text-ink mt-1 mb-4 pr-10">{p.title}</h3>
            {p.overview && <p className="text-ink/80 text-[15px] mb-6">{p.overview}</p>}
            {p.features.length > 0 && <Block title={<><Icon name="sparkles" size={16} /> Key features</>}><List items={p.features} /></Block>}
            {p.architecture && <Block title={<><Icon name="layers" size={16} /> How it's built</>}><p className="text-[14.5px] text-ink/80">{p.architecture}</p></Block>}
            {p.my_role && <Block title={<><Icon name="user" size={16} /> My role</>}><p className="text-[14.5px] text-ink/80">{p.my_role}</p></Block>}
            {p.challenges.length > 0 && <Block title={<><Icon name="mountain" size={16} /> Challenges & learnings</>}><List items={p.challenges} /></Block>}
            <Block title={<><Icon name="wrench" size={16} /> Tech stack</>}>
              <div className="flex flex-wrap gap-1.5">{p.tech_stack.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </Block>
          </div>
        </div>
      </div>
    </div>
  )
}
