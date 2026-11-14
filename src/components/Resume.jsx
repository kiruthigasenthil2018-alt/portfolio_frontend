import { useRef, useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { downloadFile } from '../utils/download.js'
import Icon from './Icon.jsx'
import RobotBubble from './RobotBubble.jsx'
import SectionHead from './SectionHead.jsx'
import { renderPdfInto } from '../utils/pdf.js'
import useReveal from '../hooks/useReveal.js'

export default function Resume() {
  const { profile, robot } = usePortfolio()
  const [ref, visible] = useReveal()
  const viewerRef = useRef(null)
  const [rendered, setRendered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const resumeFile = profile.resume_url

  const handlePreview = async () => {
    if (rendered || loading || !resumeFile) return
    setLoading(true)
    try {
      await renderPdfInto(viewerRef.current, resumeFile)
      setRendered(true)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (!resumeFile) return null

  return (
    <section id="resume" className="py-24 md:py-28 band tone-sky">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.resume} className="mb-6" />
        <SectionHead num="06" label="RESUME" emoji="file-text" title="Get the full picture." />

        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 items-stretch">
          <div className="duo p-8 flex flex-col justify-between mr-3 mb-3">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-soft bd-c border-2 flex items-center justify-center mb-6 t-c shadow-[3px_3px_0_var(--sh1)]"><Icon name="file-text" size={30} /></div>
              <h3 className="font-head text-xl mb-2 text-ink">Kiruthiga_V_Resume.pdf</h3>
              <p className="text-ink/80 text-[15px] mb-1">{profile.resume_title}</p>
              <p className="text-ink/80 text-[15px]">{profile.resume_subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={handlePreview} className="btn btn-primary btn-sm">
                {loading ? <><Icon name="loader" className="animate-spin" /> Loading…</> : <><Icon name="eye" /> Preview Resume</>}
              </button>
              <button onClick={() => downloadFile(resumeFile, 'Kiruthiga_V_Resume.pdf')} className="btn btn-ghost btn-sm">
                <Icon name="download" /> Download PDF
              </button>
            </div>
          </div>

          <div className="duo overflow-hidden min-h-[420px] relative mr-3 mb-3">
            <div ref={viewerRef} className={`w-full max-h-[640px] overflow-y-auto p-3 ${rendered ? '' : 'hidden'}`} />
            {!rendered && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
                <Icon name="file-text" size={48} className="t-c opacity-70" />
                <p className="text-ink/80 text-[15px] max-w-[32ch]">
                  Click "Preview Resume" and it'll open right here.
                </p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center px-8">
                <p className="text-ink/80 text-[15px] text-center">
                  Preview couldn't load in this browser — please use Download instead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
