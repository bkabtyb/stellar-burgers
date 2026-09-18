import { test } from '@playwright/test';

test('record ingredients HAR', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    update: true,
    updateContent: 'embed',
    url: '**/api/ingredients'
  });

  await page.goto('/');

  await page.waitForLoadState('networkidle');
});