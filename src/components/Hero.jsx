import { usePortfolio } from '../context.jsx'
import { useUI, goTo } from '../ui.jsx'
import { downloadVCard } from '../utils/vcard.js'
import useTypewriter from '../hooks/useTypewriter.js'
import useCountUp from '../hooks/useCountUp.js'
import RobotBubble from './RobotBubble.jsx'
import Icon from './Icon.jsx'

function Stat({ value, suffix = '', label, emoji, tone }) {
  const [ref, n] = useCountUp(value)
  return (
    <div ref={ref} className={`duo tone-${tone} px-4 py-3 text-center !shadow-[4px_4px_0_var(--sh1),8px_8px_0_var(--sh2)]`}>
      <div className="mb-1.5 t-c flex justify-center"><Icon name={emoji} size={22} /></div>
      <div className="font-head font-bold text-[26px] t-c leading-none">{n}{suffix}</div>
      <div className="font-mono text-[11px] text-inkmuted mt-1">{label}</div>
    </div>
  )
}

export default function Hero() {
  const { profile, robot, projects, skill_groups } = usePortfolio()
  const { openPalette, openAssistant } = useUI()
  const roles = profile.hero_roles?.length ? profile.hero_roles : []
  const typed = useTypewriter(roles)
  const [lead, tail] = splitArrow(profile.hero_title)
  const ticker = profile.marquee_items
  const skillCount = (skill_groups || []).reduce((n, g) => n + (g.items?.length || 0), 0)
  const reportCount = projects.filter((p) => p.report_url).length

  return (
    <section className="relative overflow-hidden border-b-2 border-lav-200 pt-14 md:pt-20">
      <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-rose-300/50 blur-[110px]" />
      <div className="pointer-events-none absolute top-10 -right-32 w-[460px] h-[460px] rounded-full bg-lav-300/60 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[260px] rounded-full bg-sky-300/40 blur-[110px]" />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-14 md:gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 border-2 border-lav-200 rounded-full px-4 py-1.5 bg-white font-mono text-[12.5px] font-semibold text-lav-700 mb-6 shadow-[3px_3px_0_var(--sh1)]">
            <span className="w-[9px] h-[9px] rounded-full bg-mint-500 dot-pulse" />
            {profile.status_badge}
          </div>

          <h1 className="font-head font-semibold text-[40px] md:text-[62px] leading-[1.08] mb-4 text-ink">
            {lead}
            {tail !== null && <span className="grad-text"> → </span>}
            {tail}
          </h1>

          {roles.length > 0 && (
            <p className="font-mono text-[16px] md:text-[19px] font-semibold text-rose-600 mb-5 min-h-[1.8em]" aria-label={roles.join(', ')}>
              <span aria-hidden="true" className="inline-flex items-center gap-2"><Icon name="terminal" size={19} />{typed}<span className="caret" /></span>
            </p>
          )}

          <p className="text-ink/80 text-[17px] max-w-[54ch] mb-8">{profile.hero_subtitle}</p>

          <div className="flex flex-wrap gap-3.5 mb-5">
            <button onClick={() => goTo('projects')} className="btn btn-primary"><Icon name="rocket" /> View my work</button>
            <button onClick={() => goTo('reports')} className="btn btn-ghost tone-mint"><Icon name="file-text" /> Project reports</button>
            <button onClick={() => goTo('contact')} className="btn btn-ghost tone-coral"><Icon name="mail" /> Get in touch</button>
          </div>
          <div className="flex flex-wrap gap-3 mb-8 text-[13px] font-semibold">
            <button onClick={() => downloadVCard(profile)} className="chip !text-[12.5px] !px-3 !py-1.5 hover:-translate-y-0.5 transition tone-sky"><Icon name="contact" size={15} /> Save my contact</button>
            <button onClick={openAssistant} className="chip !text-[12.5px] !px-3 !py-1.5 hover:-translate-y-0.5 transition tone-pink"><Icon name="bot" size={15} /> Ask about me</button>
            <button onClick={openPalette} className="chip !text-[12.5px] !px-3 !py-1.5 hover:-translate-y-0.5 transition tone-amber"><Icon name="keyboard" size={15} /> Press Ctrl K</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[560px] mr-3">
            <Stat value={projects.length} label="Projects" emoji="rocket" tone="lavender" />
            <Stat value={reportCount} label="Reports" emoji="file-text" tone="mint" />
            <Stat value={skillCount} suffix="+" label="Skills" emoji="wrench" tone="sky" />
            <Stat value={2} label="Stacks" emoji="atom" tone="pink" />
          </div>

          {profile.hero_stack_line && (
            <p className="font-mono text-[12.5px] font-medium text-inkmuted border-l-4 border-rose-300 pl-3.5 mt-8">{profile.hero_stack_line}</p>
          )}
          <RobotBubble text={robot.hero} size="lg" className="mt-7 max-w-[480px]" />
        </div>

        <div className="relative max-w-[420px] w-full mx-auto md:mx-0 pb-6">
          <div className="absolute inset-0 -rotate-[5deg] rounded-[28px] bg-rose-300/80" />
          <div className="absolute inset-0 rotate-[4deg] rounded-[28px] bg-lav-300/80" />
          <div className="absolute -top-5 -right-4 z-10 w-12 h-12 rounded-2xl bg-white border-2 border-rose-200 text-rose-500 flex items-center justify-center bob shadow-[3px_3px_0_var(--sh1)]"><Icon name="sparkles" size={22} /></div>
          <div className="absolute -bottom-3 -left-5 z-10 w-12 h-12 rounded-2xl bg-white border-2 border-lav-300 text-lav-600 flex items-center justify-center bob shadow-[3px_3px_0_var(--sh1)]" style={{ animationDelay: '.8s' }}><Icon name="code" size={22} /></div>
          <div className="relative duo rounded-[28px] p-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-lav-100 mb-4">
              <img src={profile.photo} alt={`${profile.name} — full stack developer`} className="w-full h-full object-cover" width="900" height="1163" />
            </div>
            <div className="flex justify-between font-mono text-xs font-semibold text-inkmuted">
              <span>FIG. 01</span><span>PROFILE</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3.5">
              {[['React', 'sky'], ['React Native', 'pink'], ['Django', 'mint'], ['Python', 'amber']].map(([t, tone]) => (
                <span key={t} className={`chip tone-${tone}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {ticker?.length > 0 && (
        <div className="relative mt-14 border-y-2 border-lav-200 bg-gradient-to-r from-lav-200 via-rose-200 to-sky-100 py-4 overflow-hidden">
          <div className="flex gap-10 whitespace-nowrap animate-[marquee_26s_linear_infinite] font-mono text-[13.5px] font-semibold text-lav-700 tracking-wide w-max">
            {[...ticker, ...ticker].map((item, i) => (<span key={i} className="inline-flex items-center gap-2"><Icon name="sparkles" size={13} />{item}</span>))}
          </div>
        </div>
      )}
    </section>
  )
}

function splitArrow(title) {
  const parts = title.split('→')
  if (parts.length < 2) return [title, null]
  return [parts[0].trimEnd(), parts.slice(1).join('→').trimStart()]
}
