import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CaseStudyPage } from './components/CaseStudyPage'
import { caseStudies } from './data/content'
import './index.css'

const root = document.getElementById('root')!
const study = caseStudies.find((item) => item.slug === root.dataset.slug)

if (!study) throw new Error(`Unknown case study: ${root.dataset.slug}`)

createRoot(root).render(
  <StrictMode>
    <CaseStudyPage study={study} />
  </StrictMode>,
)
