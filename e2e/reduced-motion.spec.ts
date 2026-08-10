import { expect, test } from '@playwright/test'

test.describe('@S21 Reduced motion does not block content or contact', () => {
  test.use({
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  })

  test('Contact and LinkedIn remain usable when prefers-reduced-motion is reduce', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'Luis Mendieta' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'About' })).toBeAttached()

    const contact = page.getByRole('region', { name: 'say hi' })
    await contact.scrollIntoViewIfNeeded()

    const name = contact.getByLabel('Name')
    const message = contact.getByLabel('Message')
    const send = contact.getByRole('button', { name: 'Send' })
    const linkedIn = contact.getByRole('link', { name: 'LinkedIn' })

    await expect(name).toBeVisible()
    await expect(message).toBeVisible()
    await expect(send).toBeVisible()
    await expect(linkedIn).toBeVisible()

    // Motion must not gate interaction (no inert overlay / pointer-events lock).
    for (const control of [name, message, send, linkedIn]) {
      await expect(control).toBeEnabled()
      const pointerEvents = await control.evaluate((el) => getComputedStyle(el).pointerEvents)
      expect(pointerEvents, 'control blocked by pointer-events').not.toBe('none')
    }

    await name.fill('Motion Preferrer')
    await message.fill('Can complete contact without decorative motion')
    await expect(name).toHaveValue('Motion Preferrer')
    await expect(message).toHaveValue('Can complete contact without decorative motion')

    await expect(linkedIn).toHaveAttribute('href', /linkedin\.com/i)
  })
})
