import { expect, test, type Locator, type Page } from '@playwright/test'

async function assertNoHorizontalClip(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    }
  })
  expect(
    overflow.scrollWidth,
    `horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 1)
}

async function assertInViewport(locator: Locator) {
  await expect(locator).toBeVisible()
  const box = await locator.boundingBox()
  expect(box, 'element has no bounding box').not.toBeNull()
  const viewport = locator.page().viewportSize()
  expect(viewport).not.toBeNull()
  expect(box!.y + box!.height > 0, 'element is above the viewport').toBe(true)
  expect(box!.y < viewport!.height, 'element is below the first viewport').toBe(true)
  expect(box!.x + box!.width > 0, 'element is left of the viewport').toBe(true)
  expect(box!.x < viewport!.width, 'element is right of the viewport').toBe(true)
}

async function assertSectionReachable(page: Page, name: string) {
  const section = page.getByRole('region', { name })
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeVisible()
}

test.describe('@S8 Mobile viewport keeps content and actions usable', () => {
  test('390×844 keeps sections reachable and Contact controls usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'Luis Mendieta' })).toBeVisible()
    await assertNoHorizontalClip(page)

    for (const name of ['About', 'Experience', 'Education', 'Testimonials', 'say hi']) {
      await assertSectionReachable(page, name)
    }

    const contact = page.getByRole('region', { name: 'say hi' })
    await contact.scrollIntoViewIfNeeded()
    await expect(contact.getByLabel('Name')).toBeVisible()
    await expect(contact.getByLabel('Message')).toBeVisible()
    await expect(contact.getByRole('button', { name: 'Send' })).toBeVisible()
    await expect(contact.getByRole('link', { name: 'LinkedIn' })).toBeVisible()
    await assertNoHorizontalClip(page)
  })
})

test.describe('@S14 Very narrow mobile viewport does not hide primary actions', () => {
  test('320-wide Contact keeps Send and LinkedIn activatable without horizontal pan', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await page.goto('/')

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

    await name.fill('Recruiter')
    await message.fill('Hello from narrow viewport')
    await expect(send).toBeEnabled()
    await expect(linkedIn).toBeEnabled()

    await assertInViewport(send)
    await assertInViewport(linkedIn)
    await assertNoHorizontalClip(page)
  })
})

test.describe('@S19 Desktop viewport presents a cohesive first-viewport composition', () => {
  test('1280×800 first viewport is a personal-brand composition with section access', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const name = page.getByRole('heading', { level: 1, name: 'Luis Mendieta' })
    await assertInViewport(name)

    const primaryRole = page.getByText('Software Engineer', { exact: true }).first()
    const secondaryRole = page.getByText(/Lead Full-Stack AI Engineer/i).first()
    await assertInViewport(primaryRole)
    await assertInViewport(secondaryRole)

    for (const sectionName of ['About', 'Experience', 'Education', 'Testimonials', 'say hi']) {
      await expect(page.getByRole('region', { name: sectionName })).toBeAttached()
    }

    // Desktop must not require mobile-only chrome (no hamburger-only primary nav gate).
    await expect(page.getByRole('button', { name: /menu|hamburger/i })).toHaveCount(0)
  })
})
