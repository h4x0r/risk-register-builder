import { test, expect } from '@playwright/test';

async function seedOneThreat(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => {
    localStorage.setItem('risk-register-storage', JSON.stringify({
      state: {
        language: 'en',
        entries: [{
          id: 'ransomware', name: '勒索軟件', nameEn: 'Ransomware', category: 'cyber',
          source: 'adversarial', pillars: ['technology'], stride: ['tampering'],
          probability: 5, impactLife: 4, impactAsset: 5, impactBusiness: 5,
          controlInternal: 1, controlExternal: 2, mitigationStrategy: 'Offline backups',
        }],
      },
      version: 1,
    }));
  });
  await page.reload();
  await page.waitForTimeout(1000);
}

test('both matrices render, and strong controls move the threat toward the origin', async ({ page }) => {
  await seedOneThreat(page);

  const row = page.getByTestId('risk-register-table').locator('tbody tr').first();
  const inherent = await row.locator('td').nth(2).textContent();
  const residual = await row.locator('td').nth(3).textContent();

  // Inherent sits at the far corner; controls are near-strongest, so residual must
  // be strictly closer in. If these ever read the same the second matrix is decorative.
  expect(inherent).toContain('5×5');
  expect(residual).not.toContain('5×5');

  // Two grids on the page, one threat plotted in each.
  const grids = page.locator('.grid-cols-5');
  expect(await grids.count()).toBeGreaterThanOrEqual(2);
});

test('a rationale survives a reload', async ({ page }) => {
  await seedOneThreat(page);

  await page.getByRole('button', { name: /0\/6/ }).first().click();
  const field = page.getByPlaceholder(/Why this score/).first();
  await field.fill('Two attempts blocked in the last 12 months.');
  await page.waitForTimeout(400);

  await page.reload();
  await page.waitForTimeout(1000);

  // The counter reflects it without reopening the drawer...
  await expect(page.getByRole('button', { name: /1\/6/ })).toBeVisible();

  // ...and the text itself came back.
  await page.getByRole('button', { name: /1\/6/ }).first().click();
  await expect(page.getByPlaceholder(/Why this score/).first()).toHaveValue(
    'Two attempts blocked in the last 12 months.'
  );
});

test('the responsibility notice is on the page and expands in full', async ({ page }) => {
  await seedOneThreat(page);

  const footer = page.locator('footer');
  await expect(footer).toContainText('It does not supply it');
  await expect(footer).toContainText('remain yours');

  await footer.getByRole('button', { name: /Read the full notice/ }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  // The three things the notice has to say: what it is, who is responsible, where
  // the data goes.
  await expect(dialog).toContainText('teaching and organising aid');
  await expect(dialog).toContainText('rests entirely with you');
  await expect(dialog).toContainText('stays in your own browser');
});

test('PNG export produces a downloadable image', async ({ page }) => {
  await seedOneThreat(page);

  await page.getByRole('button', { name: /Export/ }).click();
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await page.getByRole('menuitem', { name: /PNG/ }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^risk-register-\d{4}-\d{2}-\d{2}\.png$/);

  // A zero-byte or near-empty file would still "download" — check it holds a real
  // image by reading the PNG signature and a plausible size.
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  const bytes = Buffer.concat(chunks);

  expect(bytes.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  expect(bytes.length).toBeGreaterThan(20_000);
});

test('exporting with nothing in the register is not offered', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(900);

  // Export is disabled rather than producing an empty artefact.
  await expect(page.getByRole('button', { name: /Export/ })).toBeDisabled();
});
