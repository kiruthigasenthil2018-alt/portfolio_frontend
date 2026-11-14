import { usePortfolio } from '../context.jsx'

import Icon from './Icon.jsx'

export default function Footer() {
  const { stats } = usePortfolio()
  const visits = stats?.visits || 0
  return (
    <footer className="border-t-2 border-lav-200 bg-gradient-to-r from-lav-200 via-rose-100 to-sky-100 py-7">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex justify-between flex-wrap gap-2.5 font-mono text-[12px] font-semibold text-lav-700">
        <span className="inline-flex items-center gap-1.5"><Icon name="heart" size={14} /> KIRUTHIGA</span>
        {visits > 0 && <span className="inline-flex items-center gap-1.5"><Icon name="eye" size={14} /> {visits.toLocaleString()} visits</span>}
        <span className="inline-flex items-center gap-1.5"><Icon name="code" size={14} /> REV. 2026 · Built with React + Django</span>
      </div>
    </footer>
  )
}
