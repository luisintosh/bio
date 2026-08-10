import { describe, expect, it } from 'vitest'
import { isSafeHttpUrl } from './url'

describe('@S12 isSafeHttpUrl URL guard', () => {
  it('accepts an https LinkedIn URL', () => {
    expect(isSafeHttpUrl('https://www.linkedin.com/in/example')).toBe(true)
  })

  it.each([
    { url: 'javascript:alert(1)', label: 'javascript:' },
    { url: 'data:text/html,<script>alert(1)</script>', label: 'data:' },
  ])('rejects $label hrefs', ({ url }) => {
    expect(isSafeHttpUrl(url)).toBe(false)
  })
})
