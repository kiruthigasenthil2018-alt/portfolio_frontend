import Icon from './Icon.jsx'
import { useRef, useState } from 'react'

const FEMALE_HINTS = /female|zira|samantha|victoria|moira|tessa|fiona|karen|susan|heera|veena|raveena|aditi|kalpana|lekha/i

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const enIN = voices.filter((v) => /en-IN/i.test(v.lang))
  return (
    enIN.find((v) => FEMALE_HINTS.test(v.name)) ||
    enIN[0] ||
    voices.find((v) => FEMALE_HINTS.test(v.name) && /^en/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null
  )
}

export default function RobotBubble({ text, size = 'md', className = '' }) {
  const [speaking, setSpeaking] = useState(false)
  const utterRef = useRef(null)
  if (!text) return null

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-IN'
    const voice = pickVoice()
    if (voice) utter.voice = voice
    utter.rate = 1
    utter.pitch = 1.2
    utter.onend = () => setSpeaking(false)
    utterRef.current = utter
    setSpeaking(true)
    window.speechSynthesis.speak(utter)
  }

  const iconSize = size === 'lg' ? 'w-11 h-11' : 'w-10 h-10'

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <svg viewBox="0 0 48 48" className={`${iconSize} shrink-0 mt-1 ${size === 'lg' ? 'bob' : ''}`} aria-hidden="true">
        <rect x="10" y="16" width="28" height="22" rx="7" fill="#F1E9FF" stroke="#9B79E6" strokeWidth="1.8" />
        <circle cx="19" cy="27" r="3" fill="#7C57C9" />
        <circle cx="29" cy="27" r="3" fill="#E8559A" />
        <rect x="18" y="33" width="12" height="2.4" rx="1.2" fill="#F58BBD" />
        <line x1="24" y1="16" x2="24" y2="9" stroke="#9B79E6" strokeWidth="1.8" />
        <circle cx="24" cy="7" r="2.6" fill="#F58BBD" />
        {size === 'lg' && (
          <>
            <rect x="4" y="22" width="5" height="9" rx="2.5" fill="#FFE6F1" stroke="#F58BBD" strokeWidth="1.4" />
            <rect x="39" y="22" width="5" height="9" rx="2.5" fill="#EFE6FF" stroke="#9B79E6" strokeWidth="1.4" />
          </>
        )}
      </svg>
      <div className="bg-white/90 backdrop-blur-md border border-lav-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-[13px] text-ink/75 flex items-center gap-3 shadow-[4px_4px_0_var(--sh1)]">
        <span>{text}</span>
        <button
          onClick={speak}
          aria-label="Play voice explanation"
          className={`shrink-0 w-7 h-7 rounded-full bg-lav-100 hover:bg-rose-100 flex items-center justify-center transition-colors ${speaking ? 'animate-pulse' : ''}`}
        >
          <Icon name="volume" size={15} />
        </button>
      </div>
    </div>
  )
}
