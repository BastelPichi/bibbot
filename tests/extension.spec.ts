import { expect, test } from './fixtures'

const EXAMPLE_URL = 'https://www.zeit.de/2021/11/soziale-ungleichheit-identitaetspolitik-diskriminierung-armut-bildung'

test('content script', async ({ page, context }) => {
  await page.goto(EXAMPLE_URL)
  const shadowNode = await page.locator('.article-body > div:last-child').first()
  const shadowHTML = await shadowNode.evaluate(node => node.shadowRoot.innerHTML)
  await expect(shadowHTML).toContain('BibBot')
  await expect(shadowHTML).toContain('Pressedatenbank wird aufgerufen...')
  // library login page is opened in a new tab
  // but not as a popup from current page, instead via the background script
  const pages = context.pages()
  const lastPage = pages[pages.length - 1]
  expect(lastPage.url()).toContain('https://www.voebb.de/oidcp/authorize')
})

test('popup page', async ({ page, extensionId, context }) => {
  await page.goto(`chrome-extension://${extensionId}/popup/popup.html`)
  await expect(page.locator('body')).toContainText('BibBot')
  const settingsLink = await page.locator('#settings')
  await expect(settingsLink).toHaveText('Einstellungen')
  // await settingsLink.click()
  // const pages = await context.pages()
  // const lastPage = pages[pages.length - 1]
  // await expect(lastPage.url()).toBe(`chrome-extension://${extensionId}/options/options.html`)
})

test('option page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options/options.html`)
  await expect(page.locator('body')).toContainText('BibBot')
})
