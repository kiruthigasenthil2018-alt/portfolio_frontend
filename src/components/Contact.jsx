import { useState } from 'react'
import { usePortfolio } from '../context.jsx'
import { sendMessage } from '../api.js'
import RobotBubble from './RobotBubble.jsx'
import Icon from './Icon.jsx'
import { downloadVCard } from '../utils/vcard.js'
import useReveal from '../hooks/useReveal.js'

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const { profile, robot } = usePortfolio()
  const [ref, visible] = useReveal()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { window.prompt('Copy my email:', profile.email) }
  }

  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${profile.email}&su=Portfolio%20Inquiry`
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email'
    if (form.message.trim().length < 5) next.message = 'Please write a short message'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await sendMessage(form)
      setForm(EMPTY)
      setStatus('sent')
    } catch (err) {
      if (err.fields && typeof err.fields === 'object') {
        const mapped = {}
        for (const k of ['name', 'email', 'message']) if (err.fields[k]) mapped[k] = String(err.fields[k][0] ?? err.fields[k])
        setErrors(mapped)
      }
      setStatus('error')
    }
  }

  const link = 'font-semibold text-ink border-b-2 border-lav-300 pb-0.5 hover:text-rose-600 hover:border-rose-400'

  return (
    <section id="contact" className="py-24 md:py-28 band tone-coral">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.contact} className="mb-6" />

        <div className="duo p-8 md:p-12 mr-3 mb-3 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[13px] font-semibold tracking-wide mb-3 t-c bg-soft bd-c border rounded-full px-3.5 py-1.5"><Icon name="mail" size={17} />07 / CONTACT</span>
            <h2 className="font-head font-semibold text-[28px] md:text-[38px] mb-3.5 text-ink leading-tight">
              {profile.contact_title}
            </h2>
            <p className="text-ink/80 max-w-[46ch] mb-7">{profile.contact_text}</p>
            <div className="flex flex-col gap-3 font-mono text-[13.5px] items-start">
              <a href={gmail} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}><Icon name="mail" size={16} /> {profile.email}</a>
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}><Icon name="linkedin" size={16} /> LinkedIn</a>
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}><Icon name="github" size={16} /> GitHub</a>
              {profile.location && <span className="text-ink font-semibold inline-flex items-center gap-2"><Icon name="pin" size={16} /> {profile.location}</span>}
              <div className="flex flex-wrap gap-2.5 mt-2 font-sans">
                <button type="button" onClick={copyEmail} className="chip !text-[12.5px] !px-3 !py-1.5 tone-sky">{copied ? <><Icon name="check" size={14} /> Copied!</> : <><Icon name="copy" size={14} /> Copy email</>}</button>
                <button type="button" onClick={() => downloadVCard(profile)} className="chip !text-[12.5px] !px-3 !py-1.5 tone-pink"><Icon name="contact" size={14} /> Save contact</button>
              </div>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="flex flex-col gap-4" aria-describedby="contact-status">
            {[
              ['name', 'Your name', 'text', 'name'],
              ['email', 'Your email', 'email', 'email'],
            ].map(([key, label, type, auto]) => (
              <div key={key}>
                <label htmlFor={`c-${key}`} className="block text-[13px] font-bold text-lav-700 mb-1.5">{label}</label>
                <input id={`c-${key}`} type={type} autoComplete={auto} value={form[key]} onChange={set(key)} className="field" aria-invalid={!!errors[key]} />
                {errors[key] && <p className="text-[12.5px] text-rose-600 mt-1">{errors[key]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="c-message" className="block text-[13px] font-bold text-lav-700 mb-1.5">Message</label>
              <textarea id="c-message" rows={4} value={form.message} onChange={set('message')} className="field resize-y" aria-invalid={!!errors.message} />
              {errors.message && <p className="text-[12.5px] text-rose-600 mt-1">{errors.message}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === 'sending'} className="btn btn-primary disabled:opacity-60">
                {status === 'sending' ? (<><Icon name="loader" className="animate-spin" /> Sending…</>) : (<><Icon name="send" /> Send message</>)}
              </button>
              <p id="contact-status" role="status" className="text-[14px]">
                {status === 'sent' && <span className="text-lav-700">Thank you — your message has arrived.</span>}
                {status === 'error' && (
                  <span className="text-rose-600">
                    Couldn't send right now. Please{' '}
                    <a href={gmail} target="_blank" rel="noopener noreferrer" className="underline">email me directly</a>.
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
