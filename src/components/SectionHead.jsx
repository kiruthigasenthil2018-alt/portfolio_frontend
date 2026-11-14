import Icon from './Icon.jsx'

export default function SectionHead({ num, label, emoji, title, className = 'mb-12' }) {
  return (
    <div className={className}>
      <span className="inline-flex items-center gap-2 font-mono text-[13px] font-semibold tracking-wide mb-3 t-c bg-soft bd-c border rounded-full px-3.5 py-1.5 shadow-[3px_3px_0_var(--sh1)]">
        <Icon name={emoji} size={17} />
        {num} / {label}
      </span>
      <h2 className="font-head font-semibold text-[30px] md:text-[42px] leading-tight text-ink">{title}</h2>
    </div>
  )
}
