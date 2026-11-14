// Subtle 3D tilt that follows the mouse (skipped on touch screens and for reduced-motion users).
const off = () => window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const tilt = {
  onMouseMove(e) {
    if (off()) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
  },
  onMouseLeave(e) {
    e.currentTarget.style.setProperty('--ry', '0deg')
    e.currentTarget.style.setProperty('--rx', '0deg')
  },
}
