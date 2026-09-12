import { test, expect } from '@playwright/test';

/**
 * The register prints matrix coordinates for each threat. They must track the
 * ratings, or the table and the two matrices tell different stories about the same
 * threat — which is the failure this whole screen exists to avoid.
 */
test('register coordinates follow the ratings', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(900);

  await page.locator('input[placeholder*="自訂"], input[placeholder*="Custom"]').fill('Test Threat');
  await page.getByRole('button', { name: /Add|新增/ }).last().click();
  await page.waitForTimeout(400);

  const row = page.getByTestId('risk-register-table').locator('tbody tr').first();
  const inherentCell = row.locator('td').nth(2);
  const residualCell = row.locator('td').nth(3);

  // Everything defaults to 3, so impact mean 3 against probability 3.
  await expect(inherentCell).toContainText('3×3');

  // Probability 5 moves the y axis only.
  const inherent = page.locator('[data-testid^="inherent-row-"]').first();
  await inherent.getByRole('radio', { name: /Probability 5$/ }).click();
  await expect(inherentCell).toContainText('3×5');

  // Raising one impact to 5 rounds the mean (5+3+3)/3 = 3.67 up to 4.
  await inherent.getByRole('radio', { name: /Life Safety 5$/ }).click();
  await expect(inherentCell).toContainText('4×5');

  // All three impacts at 5 gives a mean of 5.
  await inherent.getByRole('radio', { name: /Asset Safety 5$/ }).click();
  await inherent.getByRole('radio', { name: /Business Operations 5$/ }).click();
  await expect(inherentCell).toContainText('5×5');

  // Residual is a separate coordinate and must not silently equal inherent when
  // controls are anything other than fully ineffective.
  await expect(residualCell).not.toContainText('5×5');

  // Both matrices are on the page, each holding the one threat.
  const dots = page.locator('.grid-cols-5 span.rounded-full');
  expect(await dots.count()).toBeGreaterThanOrEqual(2);
});
