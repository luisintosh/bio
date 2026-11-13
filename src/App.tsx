import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Principles } from './components/Principles'
import { Projects } from './components/Projects'
import { SiteShell } from './components/SiteShell'
import { Testimonials } from './components/Testimonials'

export default function App() {
  return (
    <SiteShell hero={<Hero />}>
      <Intro />
      <Projects />
      <Principles />
      <Experience />
      <Testimonials />
    </SiteShell>
  )
}
