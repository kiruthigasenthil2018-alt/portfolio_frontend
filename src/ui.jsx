import { createContext, useContext } from 'react'

// Lets any component open the project panel, the report preview, the search palette or the assistant.
export const UIContext = createContext({
  openProject: () => {}, openReport: () => {}, openPalette: () => {}, openAssistant: () => {}, goTo: () => {},
})
export const useUI = () => useContext(UIContext)

export const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
