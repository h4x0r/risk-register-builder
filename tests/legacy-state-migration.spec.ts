import { test, expect } from '@playwright/test';

/**
 * Entries persist to localStorage, so a returning user arrives holding state written
 * under the pre-expansion taxonomy. That path does not go through decodeEntries, so
 * it needs its own migration — and without one the category lookup dereferences
 * undefined and the page dies on render.
 */
test('a returning user with pre-expansion localStorage state still gets a working page', async ({ page }) => {
  const crashes: string[] = [];
  page.on('pageerror', (err) => crashes.push(err.message));

  await page.goto('/');

  // Seed exactly what the old build persisted: the three-category model, no tags.
  await page.evaluate(() => {
    localStorage.setItem('risk-register-storage', JSON.stringify({
      state: {
        language: 'en',
        entries: [
          { id: 'fire', name: '火災', nameEn: 'Fire', category: 'technical',
            probability: 4, impactLife: 5, impactAsset: 4, impactBusiness: 3,
            controlInternal: 2, controlExternal: 2, mitigationStrategy: 'Fire drill' },
          { id: 'cyber-attack', name: '網絡攻擊', nameEn: 'Cyber Attack', category: 'security',
            probability: 3, impactLife: 1, impactAsset: 3, impactBusiness: 5,
            controlInternal: 3, controlExternal: 3, mitigationStrategy: '' },
        ],
      },
      version: 0,
    }));
  });
  await page.reload();
  await page.waitForTimeout(1500);

  // The register must actually render its rows, not a blank error boundary.
  const registerTable = page.locator('table').nth(1);
  await expect(registerTable.locator('tbody tr')).toHaveCount(2);

  // And the legacy categories must have been re-homed on the way in.
  const categories = await registerTable.locator('tbody tr td:nth-child(2)').allTextContents();
  expect(categories.map((c) => c.trim())).toEqual([
    'Physical Security & Facility',
    'Cyber Attack',
  ]);

  expect(crashes, `page threw: ${crashes.join(' | ')}`).toEqual([]);
});
