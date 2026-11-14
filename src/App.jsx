import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import ReportsSection from './components/ReportsSection.jsx'
import Journey from './components/Journey.jsx'
import Resume from './components/Resume.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ProjectModal from './components/ProjectModal.jsx'
import ReportModal from './components/ReportModal.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import Assistant from './components/Assistant.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import { UIContext, goTo } from './ui.jsx'
import { usePortfolio } from './context.jsx'

export default function App() {
  const { projects } = usePortfolio()
  const [projectSlug, setProjectSlug] = useState(null)
  const [reportSlug, setReportSlug] = useState(null)
  const [palette, setPalette] = useState(false)
  const [assistant, setAssistant] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const ui = useMemo(() => ({
    openProject: setProjectSlug,
    openReport: setReportSlug,
    openPalette: () => setPalette(true),
    openAssistant: () => setAssistant(true),
    goTo,
  }), [])

  const closeProject = useCallback(() => setProjectSlug(null), [])
  const closeReport = useCallback(() => setReportSlug(null), [])
  const closePalette = useCallback(() => setPalette(false), [])
  const project = projects.find((p) => p.slug === projectSlug)
  const report = projects.find((p) => p.slug === reportSlug && p.report_url)

  return (
    <UIContext.Provider value={ui}>
      <div className="text-ink font-body leading-relaxed">
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <ReportsSection />
          <Journey />
          <Resume />
          <Contact />
        </main>
        <Footer />
        {project && <ProjectModal project={project} onClose={closeProject} />}
        {report && <ReportModal project={report} projects={projects} onClose={closeReport} onSwitch={setReportSlug} />}
        {palette && <CommandPalette onClose={closePalette} />}
        <Assistant open={assistant} onOpen={() => setAssistant(true)} onClose={() => setAssistant(false)} />
      </div>
    </UIContext.Provider>
  )
}
