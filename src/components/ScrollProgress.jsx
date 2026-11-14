import Icon from './Icon.jsx'
import { useEffect, useState } from 'react'

// Thin rainbow bar at the very top showing how far down the page you are + a back-to-top button.
export default function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? Math.min(h.scrollTop / max, 1) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[4px] z-[70] pointer-events-none" aria-hidden="true">
        <div className="h-full origin-left" style={{ transform: `scaleX(${p})`, background: 'linear-gradient(90deg,#8B5CF6,#F0589F,#FF7A59,#F5A81B,#22C39A,#2FA8F0)' }} />
      </div>
      {p > 0.08 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-white border-2 border-lav-300 text-lav-700 text-lg shadow-[3px_3px_0_var(--sh1)] hover:-translate-y-0.5 transition"
        >
          <Icon name="arrow-up" size={18} />
        </button>
      )}
    </>
  )
}
