import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => {
    localStorage.setItem('risk-register-storage', JSON.stringify({
      state: {
        language: 'en',
        entries: [{
          id: 'ransomware', name: '勒索軟件', nameEn: 'Ransomware', category: 'cyber',
          source: 'adversarial', pillars: ['technology'], stride: ['tampering'],
          probability: 3, impactLife: 3, impactAsset: 3, impactBusiness: 3,
          controlInternal: 3, controlExternal: 3, mitigationStrategy: '',
        }],
      },
      version: 1,
    }));
  });
  await page.reload();
  await page.waitForTimeout(1000);
});

test('a rating scale is one tab stop and moves on arrow keys', async ({ page }) => {
  const row = page.locator('[data-testid^="inherent-row-"]').first();
  const scale = row.getByRole('radiogroup', { name: /Probability/ });

  // Exactly one of the five is reachable by Tab; the rest are -1.
  const tabbable = scale.locator('[role="radio"][tabindex="0"]');
  await expect(tabbable).toHaveCount(1);
  await expect(scale.locator('[role="radio"][tabindex="-1"]')).toHaveCount(4);

  await tabbable.focus();
  await page.keyboard.press('ArrowRight');
  await expect(scale.getByRole('radio', { name: /Probability 4$/ })).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(scale.getByRole('radio', { name: /Probability 2$/ })).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('End');
  await expect(scale.getByRole('radio', { name: /Probability 5$/ })).toHaveAttribute('aria-checked', 'true');

  await page.keyboard.press('Home');
  await expect(scale.getByRole('radio', { name: /Probability 1$/ })).toHaveAttribute('aria-checked', 'true');
});

test('arrow keys stop at the ends instead of wrapping', async ({ page }) => {
  // Wrapping from 5 back to 1 would let a slip turn the highest score into the
  // lowest without the user noticing.
  const scale = page.locator('[data-testid^="inherent-row-"]').first()
    .getByRole('radiogroup', { name: /Probability/ });

  await scale.locator('[role="radio"][tabindex="0"]').focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await expect(scale.getByRole('radio', { name: /Probability 5$/ })).toHaveAttribute('aria-checked', 'true');

  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
  await expect(scale.getByRole('radio', { name: /Probability 1$/ })).toHaveAttribute('aria-checked', 'true');
});

test('the header does not collapse onto itself on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(400);

  const header = page.locator('header').first();
  const logo = header.locator('img').first();
  const box = await logo.boundingBox();

  // The logo must be fully inside the viewport rather than clipped by an overlapping title.
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.height).toBeGreaterThan(10);

  // And the stage numbers stay legible even though the wide rail is hidden.
  // Scoped to the card titles: the rail also renders "01" but is display:none here.
  await expect(page.getByText('01', { exact: true }).last()).toBeVisible();
  await expect(page.getByText('04', { exact: true }).last()).toBeVisible();
});
