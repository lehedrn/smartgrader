const { test, expect } = require('@playwright/test');

test.describe('Simple Test', () => {
  test('should work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    console.log('Page loaded');
  });
});
