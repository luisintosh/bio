import { portfolio as defaultPortfolio, type PortfolioContent } from './content/portfolio'
import { Hero } from './components/Hero'
import { AboutSection } from './components/AboutSection'
import { ExperienceSection } from './components/ExperienceSection'
import { EducationSection } from './components/EducationSection'
import { TestimonialsSection } from './components/TestimonialsSection'

interface AppProps {
  portfolio?: PortfolioContent
}

export default function App({ portfolio = defaultPortfolio }: AppProps) {
  return (
    <main className="app">
      <Hero hero={portfolio.hero} />
      <AboutSection about={portfolio.about} />
      <ExperienceSection experience={portfolio.experience} />
      <EducationSection education={portfolio.education} />
      <TestimonialsSection testimonials={portfolio.testimonials} />
    </main>
  )
}
