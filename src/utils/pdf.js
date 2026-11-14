// Loads pdf.js on demand and draws every page of a PDF into a container (used by Resume + report previews).
let lib

async function load() {
  if (!lib) {
    // pdf.js logs a harmless "fake worker" notice in some sandboxed previews; keep the console clean.
    const filter = (native) => (...args) => {
      if (typeof args[0] === 'string' && args[0].toLowerCase().includes('fake worker')) return
      native(...args)
    }
    console.log = filter(console.log.bind(console))
    console.warn = filter(console.warn.bind(console))
    lib = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.js?url')]).then(([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      return pdfjs
    })
  }
  return lib
}

export async function renderPdfInto(container, url, isCancelled = () => false) {
  const pdfjs = await load()
  const pdf = await pdfjs.getDocument(url).promise
  if (isCancelled()) return 0
  container.innerHTML = ''
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    if (isCancelled()) return 0
    const base = page.getViewport({ scale: 1 })
    const scale = ((container.clientWidth || 600) / base.width) * ratio
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    canvas.style.cssText = 'width:100%;display:block;margin-bottom:12px;border-radius:10px;box-shadow:0 4px 18px -8px rgba(109,63,208,.45);background:#fff'
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    if (isCancelled()) return 0
    container.appendChild(canvas)
  }
  return pdf.numPages
}
