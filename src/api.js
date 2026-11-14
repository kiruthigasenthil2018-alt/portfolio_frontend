import fallback from './fallback.json'

// Django backend. Empty in production builds unless VITE_API_URL is set -> the site then
// runs entirely from the bundled snapshot (fallback.json), which is refreshed with
// `python manage.py export_static`.
export const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')

export const fallbackData = fallback

export async function fetchPortfolio(signal) {
  if (!API_URL) return null
  const res = await fetch(`${API_URL}/api/portfolio/`, { signal })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  return data.profile ? data : null
}

export async function sendMessage(payload) {
  if (!API_URL) throw new Error('offline')
  const res = await fetch(`${API_URL}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error('failed')
    err.fields = body
    err.status = res.status
    throw err
  }
}
