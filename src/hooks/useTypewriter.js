import { useEffect, useState } from 'react'

// Types and deletes each word in turn. With reduced-motion it just shows the first word.
export default function useTypewriter(words, { type = 70, erase = 35, hold = 1400 } = {}) {
  const [text, setText] = useState(words?.[0] || '')
  useEffect(() => {
    if (!words?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, i = 0, deleting = false, timer
    const tick = () => {
      const word = words[w]
      i += deleting ? -1 : 1
      setText(word.slice(0, i))
      let delay = deleting ? erase : type
      if (!deleting && i === word.length) { deleting = true; delay = hold }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350 }
      timer = setTimeout(tick, delay)
    }
    setText('')
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [words?.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps
  return text
}
