import { usePortfolio } from '../context.jsx'
import { toneOf } from '../constants.js'
import Icon from './Icon.jsx'
import RobotBubble from './RobotBubble.jsx'
import SectionHead from './SectionHead.jsx'
import useReveal from '../hooks/useReveal.js'

export default function Journey() {
  const { robot, journey } = usePortfolio()
  const [ref, visible] = useReveal()
  return (
    <section id="journey" className="py-24 md:py-28 tone-amber">
      <div ref={ref} className={`max-w-[1320px] mx-auto px-6 md:px-12 reveal ${visible ? 'in' : ''}`}>
        <RobotBubble text={robot.journey} className="mb-6" />
        <SectionHead num="05" label="JOURNEY" emoji="map" title="How I got here." />
        <ol className="border-l-4 border-lav-300 ml-4 pl-10 flex flex-col gap-8">
          {journey.map((step, i) => (
            <li key={step.title} className={`relative tone-${toneOf('', i + 1)}`}>
              <span
                className={`absolute -left-[3.35rem] top-2 w-9 h-9 rounded-full flex items-center justify-center bg-white border-[3px] ${step.is_current ? 'dot-pulse' : ''}`}
                style={{ borderColor: 'var(--acc)' }}
                aria-hidden="true"
              >
                <Icon name={step.emoji} size={18} className="t-c" fallback="pin" />
              </span>
              <div className="duo p-5 md:p-6 max-w-[720px] mr-3 mb-3">
                <span className="font-mono text-[12.5px] font-semibold t-c block mb-1.5">{step.label}{step.is_current ? ' · NOW' : ''}</span>
                <h3 className="font-head text-lg font-semibold mb-1.5 text-ink">{step.title}</h3>
                <p className="text-ink/80 text-[15.5px]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
