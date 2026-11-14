import { useCallback, useEffect, useState } from 'react'

// Light is the default. The choice is remembered in the browser (index.html applies it before first paint).
const read = () => { try { return localStorage.getItem('theme') } catch { return null } }

export default function useTheme() {
  const [theme, setTheme] = useState(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('theme', theme) } catch { /* private mode: just keep it in memory */ }
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle, read]
}
