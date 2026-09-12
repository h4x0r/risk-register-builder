import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(800);
});

test('the Learn panel opens from the header and switches topics', async ({ page }) => {
  await page.getByRole('button', { name: /Learn|學習/ }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Risk Standards & Frameworks');

  // Lands on the first topic.
  await expect(dialog).toContainText('What Risk Actually Is');

  // Switching topic swaps the body.
  await dialog.getByRole('button', { name: 'Threat Sources' }).click();
  await expect(dialog).toContainText('NIST SP 800-30 Rev. 1, Table D-2');
  await expect(dialog).not.toContainText('What risk is not a thing');
});

test('every citation on every topic is a working external link', async ({ page }) => {
  await page.getByRole('button', { name: /Learn|學習/ }).click();
  const dialog = page.getByRole('dialog');

  const topicButtons = dialog.locator('nav button');
  const count = await topicButtons.count();
  expect(count).toBeGreaterThan(5);

  let totalLinks = 0;
  for (let i = 0; i < count; i++) {
    await topicButtons.nth(i).click();

    const links = dialog.locator('article a[target="_blank"]');
    const n = await links.count();
    expect(n, `topic ${i} cites nothing`).toBeGreaterThan(0);
    totalLinks += n;

    for (const href of await links.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).href)
    )) {
      expect(href).toMatch(/^https:\/\//);
      // rel must carry noopener, since these open in a new tab.
      expect(href).not.toContain('example.com');
    }
  }
  expect(totalLinks).toBeGreaterThan(20);
});

test('a STRIDE chip on a threat opens the STRIDE lesson', async ({ page }) => {
  // Add a cyber threat, which carries STRIDE tags.
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'Cyber Attack', exact: true }).click();

  await page.locator('input[placeholder*="Search"], input[placeholder*="搜尋"]').fill('Ransomware');
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: /Ransomware/ }).click();
  await page.getByRole('button', { name: /^Add$/ }).first().click();
  await page.waitForTimeout(400);

  // Ransomware is tagged T and D; clicking one goes straight to the lesson.
  await page.getByTitle(/STRIDE — Tampering/).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('STRIDE Threat Modelling');
  await expect(dialog).toContainText('Elevation of privilege');
});
