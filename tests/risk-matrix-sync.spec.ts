import { test, expect } from '@playwright/test';

test('risk register shows matrix coordinates that update with ratings', async ({ page }) => {
  await page.goto('/');

  // Clear localStorage to start fresh
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1000);

  // Add a custom threat
  const customInput = page.locator('input[placeholder*="自訂"], input[placeholder*="Custom"]');
  await customInput.fill('Test Threat');
  const addButtons = page.locator('button:has-text("+ ")');
  await addButtons.last().click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test-results/01-threat-added.png', fullPage: true });

  // Get the Risk Register table (second table on page)
  const riskRegisterTable = page.locator('table').nth(1);
  const riskRegisterRow = riskRegisterTable.locator('tbody tr').first();
  const cells = riskRegisterRow.locator('td');

  // Initial values: all ratings at 3, so vulnerability=3, impact=3
  const initialVulnerability = await cells.nth(1).textContent();
  const initialImpact = await cells.nth(2).textContent();
  console.log('Initial - Vulnerability:', initialVulnerability, 'Impact:', initialImpact);
  expect(initialVulnerability?.trim()).toBe('3');
  expect(initialImpact?.trim()).toBe('3');

  // Change probability to 5 (first rating group, button index 4)
  const vulnTable = page.locator('table').first();
  const vulnRow = vulnTable.locator('tbody tr').first();
  const ratingButtons = vulnRow.locator('button.rounded-full');
  await ratingButtons.nth(4).click(); // probability = 5
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'test-results/02-after-prob-change.png', fullPage: true });

  // Vulnerability should now be 5 (Y-axis = probability)
  const afterProbVuln = await cells.nth(1).textContent();
  console.log('After prob change - Vulnerability:', afterProbVuln);
  expect(afterProbVuln?.trim()).toBe('5');

  // Change life impact to 5 (second rating group, button index 9)
  await ratingButtons.nth(9).click(); // impactLife = 5
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'test-results/03-after-impact-change.png', fullPage: true });

  // Impact should now be 4 (X-axis = round((5+3+3)/3) = round(3.67) = 4)
  const afterImpactValue = await cells.nth(2).textContent();
  console.log('After impact change - Impact:', afterImpactValue);
  expect(afterImpactValue?.trim()).toBe('4');

  // Change all impact values to 5 to verify impact becomes 5
  await ratingButtons.nth(14).click(); // impactAsset = 5
  await ratingButtons.nth(19).click(); // impactBusiness = 5
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'test-results/04-all-impacts-5.png', fullPage: true });

  // Impact should now be 5 (X-axis = round((5+5+5)/3) = 5)
  const finalImpact = await cells.nth(2).textContent();
  console.log('Final - Impact:', finalImpact);
  expect(finalImpact?.trim()).toBe('5');

  // Verify matrix has dots (may have animation duplicates)
  const dotsInMatrix = page.locator('.grid-cols-5 .rounded-full.absolute');
  const dotCount = await dotsInMatrix.count();
  expect(dotCount).toBeGreaterThanOrEqual(1);

  await page.screenshot({ path: 'test-results/05-final.png', fullPage: true });
});
