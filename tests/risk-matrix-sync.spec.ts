import { test, expect } from '@playwright/test';

test('debug: risk matrix sync issue', async ({ page }) => {
  await page.goto('/');

  // Clear localStorage to start fresh
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1000);

  // Take initial screenshot
  await page.screenshot({ path: 'test-results/01-initial.png', fullPage: true });

  // Switch to expert mode - look for the button by its Chinese text
  const expertButton = page.locator('button:has-text("專家模式"), button:has-text("Expert Mode")');
  await expertButton.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test-results/02-expert-mode.png', fullPage: true });

  // Add a custom threat
  const customInput = page.locator('input[placeholder*="自訂"], input[placeholder*="Custom"]');
  await customInput.fill('Test Threat');

  // Click the add button next to custom input
  const addButtons = page.locator('button:has-text("+ ")');
  await addButtons.last().click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test-results/03-threat-added.png', fullPage: true });

  // Log the current entries state
  const stateBeforeChange = await page.evaluate(() => {
    const stored = localStorage.getItem('risk-register-storage');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('State after adding threat:', JSON.stringify(stateBeforeChange, null, 2));

  // Find all rating buttons in the table row
  const tableRow = page.locator('table tbody tr').first();
  const allButtons = tableRow.locator('button.rounded-full');
  const buttonCount = await allButtons.count();
  console.log('Total buttons in row:', buttonCount);

  // Log button texts
  for (let i = 0; i < buttonCount; i++) {
    const text = await allButtons.nth(i).textContent();
    console.log(`Button ${i}: "${text}"`);
  }

  // Click probability button "5" (should be index 4)
  console.log('Clicking probability 5...');
  await allButtons.nth(4).click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test-results/04-after-prob-5.png', fullPage: true });

  // Check state after clicking
  const stateAfterProb = await page.evaluate(() => {
    const stored = localStorage.getItem('risk-register-storage');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('State after prob change:', JSON.stringify(stateAfterProb, null, 2));

  // Click life impact button "5" (should be index 9)
  console.log('Clicking life impact 5...');
  await allButtons.nth(9).click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'test-results/05-after-life-5.png', fullPage: true });

  // Check matrix cells - look at what's in the matrix
  const matrixContainer = page.locator('.grid.grid-cols-5');
  const matrixHTML = await matrixContainer.innerHTML();
  console.log('Matrix HTML (truncated):', matrixHTML.substring(0, 1000));

  // Count dots in matrix
  const dotsInMatrix = page.locator('.grid-cols-5 .rounded-full.absolute');
  const dotCount = await dotsInMatrix.count();
  console.log('Dots in matrix:', dotCount);

  // Final state check
  const finalState = await page.evaluate(() => {
    const stored = localStorage.getItem('risk-register-storage');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('Final state:', JSON.stringify(finalState, null, 2));

  await page.screenshot({ path: 'test-results/06-final.png', fullPage: true });
});
