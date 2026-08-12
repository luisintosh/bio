import './Decor.css'

type CornerProps = {
  position: 'tl' | 'tr' | 'bl' | 'br'
}

export function Corner({ position }: CornerProps) {
  return <span className={`decor-corner decor-corner--${position}`} aria-hidden />
}
