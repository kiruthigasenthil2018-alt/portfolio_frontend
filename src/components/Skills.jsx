import { usePortfolio } from '../context.jsx'
import { toneOf } from '../constants.js'
import Icon from './Icon.jsx'
import RobotBubble from './RobotBubble.jsx'
import SectionHead from './SectionHead.jsx'
import useReveal from '../hooks/useReveal.js'

export default function Skills() {
  const { robot, skill_groups } = usePortfolio()
  const [ref, visible] = useReveal()
  return (
    <section id="skills" className="py-24 md:py-28 band tone-sky">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.skills} className="mb-6" />
        <SectionHead num="02" label="SKILLS" emoji="wrench" title="What I can build with." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {skill_groups.map((group, gi) => (
            <div key={group.title} className={`duo duo-hover p-8 mr-3 mb-3 tone-${toneOf(group.tag_color, gi)}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-2xl bg-soft bd-c border-2 flex items-center justify-center t-c"><Icon name={group.emoji} size={24} /></span>
                {group.tag && <span className="chip !font-semibold">{group.tag}</span>}
              </div>
              <h3 className="font-head text-xl font-semibold mb-5 text-ink">{group.title}</h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex justify-between items-center text-[15px] font-semibold mb-1.5">
                      <span><span className="inline-flex items-center gap-2"><Icon name={item.emoji} size={16} className="t-c" fallback="code" />{item.name}</span></span>
                      <span className="font-mono text-[11px] t-c font-semibold">{item.level}</span>
                    </div>
                    <div className="h-2.5 bg-soft rounded-full overflow-hidden border bd-c" role="progressbar" aria-valuenow={item.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.name} proficiency`}>
                      <div className="h-full meter-fill rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
