import { isSafeHttpUrl } from '../lib/url'

interface SocialLinkProps {
  href: string
  label?: string
}

export function SocialLink({ href, label = 'LinkedIn' }: SocialLinkProps) {
  if (!isSafeHttpUrl(href)) return null

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}
