import type { HeroContent } from '../content/portfolio'

interface HeroProps {
  hero: HeroContent
}

export function Hero({ hero }: HeroProps) {
  return (
    <header className="hero">
      <h1>{hero.name}</h1>
      <p className="hero-role">{hero.primaryRole}</p>
      <p className="hero-role">
        {hero.secondaryRole.replace(/-/g, '\u2013')}
      </p>
    </header>
  )
}
