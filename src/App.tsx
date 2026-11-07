import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Intro } from './components/Intro'
import { Principles } from './components/Principles'
import { Projects } from './components/Projects'
import { SiteShell } from './components/SiteShell'
import { Testimonials } from './components/Testimonials'

export default function App() {
  return (
    <SiteShell>
      <Intro />
      <Projects />
      <Principles />
      <Experience />
      <Testimonials />
      <Contact />
    </SiteShell>
  )
}
