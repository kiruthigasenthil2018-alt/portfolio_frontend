import { usePortfolio } from '../context.jsx'
import { toneOf } from '../constants.js'
import Icon from './Icon.jsx'
import RobotBubble from './RobotBubble.jsx'
import SectionHead from './SectionHead.jsx'
import useReveal from '../hooks/useReveal.js'

export default function About() {
  const { profile, robot, about_rows } = usePortfolio()
  const [ref, visible] = useReveal()
  return (
    <section id="about" className="py-24 md:py-28 tone-pink">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.about} className="mb-6" />
        <SectionHead num="01" label="ABOUT" emoji="user" title={profile.about_title} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">
          <div className="space-y-4">
            {profile.about_paragraphs.map((p, i) => (
              <p key={i} className="text-ink/85 text-[16.5px] max-w-[56ch]">{p}</p>
            ))}
          </div>
          <div className="duo overflow-hidden mr-3 mb-3">
            {about_rows.map((row, i) => (
              <div key={row.label} className={`tone-${toneOf('', i)} grid grid-cols-[1fr_1.5fr] text-[15px] ${i < about_rows.length - 1 ? 'border-b border-lav-200' : ''}`}>
                <div className="px-4 py-3.5 font-mono text-[12.5px] font-semibold t-c bg-soft border-r border-lav-200 flex items-center gap-2">
                  <Icon name={row.emoji} size={17} />{row.label}
                </div>
                <div className="px-4 py-3.5 font-medium text-ink">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
