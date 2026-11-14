// Downloads a file even when it is hosted on another origin (the `download` attribute is ignored there).
export async function downloadFile(url, filename) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1500)
  } catch {
    window.open(url, '_blank', 'noopener')
  }
}
