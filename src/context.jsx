import { createContext, useContext, useEffect, useState } from 'react'
import { API_URL, fallbackData, fetchPortfolio } from './api.js'

const PortfolioContext = createContext(fallbackData)
export const usePortfolio = () => useContext(PortfolioContext)

// If the live database has an empty list (or blank profile field), keep the bundled starter content for it.
function mergeWithStarter(live) {
  const out = { ...fallbackData, ...live }
  for (const key of Object.keys(fallbackData)) {
    const a = live[key], b = fallbackData[key]
    if (Array.isArray(b) && (!Array.isArray(a) || a.length === 0)) out[key] = b
    else if (b && typeof b === 'object' && !Array.isArray(b) && a && typeof a === 'object') {
      out[key] = { ...b }
      for (const k of Object.keys(a)) {
        const empty = a[k] == null || a[k] === '' || (Array.isArray(a[k]) && a[k].length === 0)
        if (!empty) out[key][k] = a[k]
      }
    }
  }
  return out
}

const today = () => new Date().toISOString().slice(0, 10)

// Counts one visit per browser per day (stored in the Django database; shown in the footer).
async function registerVisit() {
  try {
    if (localStorage.getItem('visit-day') === today()) return null
    const res = await fetch(`${API_URL}/api/visit/`, { method: 'POST' })
    if (!res.ok) return null
    localStorage.setItem('visit-day', today())
    return (await res.json()).visits
  } catch {
    return null
  }
}

/**
 * Shows the bundled snapshot instantly, then swaps in live data from the Django API
 * when it responds (free hosts can take ~1 min to wake up, so we never block on it).
 */
export function PortfolioProvider({ children }) {
  const [data, setData] = useState(fallbackData)

  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 90000)
    fetchPortfolio(ctrl.signal)
      .then(async (live) => {
        if (!live) return
        // If a list is empty on the server (e.g. the database was never seeded), keep the bundled copy so no section shows blank.
        const merged = { ...live }
        for (const k of ['projects', 'skill_groups', 'journey', 'about_rows']) if (!live[k]?.length) merged[k] = fallbackData[k]
        merged.robot = { ...fallbackData.robot, ...(live.robot || {}) }
        if (!live.reports_zip) merged.reports_zip = fallbackData.reports_zip
        setData(merged)
        const visits = await registerVisit()
        if (visits) setData((d) => ({ ...d, stats: { ...(d.stats || {}), visits } }))
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer))
    return () => { ctrl.abort(); clearTimeout(timer) }
  }, [])

  return <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>
}
