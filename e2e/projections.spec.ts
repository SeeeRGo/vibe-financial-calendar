import { test, expect } from '@playwright/test';

test.describe('Projections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Sign in (you'll need to implement this based on your auth setup)
    await page.getByRole('button', { name: 'Manage Categories' }).click();
  });

  test('shows projection for a category', async ({ page }) => {
    await page.getByRole('button', { name: 'Project' }).first().click();
    
    await expect(page.getByText(/Projected Balance/)).toBeVisible();
    await expect(page.getByText(/projected spend/)).toBeVisible();
  });

  test('updates projection when changing date', async ({ page }) => {
    await page.getByRole('button', { name: 'Project' }).first().click();
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.getByRole('textbox', { type: 'date' }).fill(nextMonth.toISOString().split('T')[0]);
    
    // Verify the projection updates (specific assertions will depend on your data)
    await expect(page.getByText(/projected spend/)).toBeVisible();
  });

  test('shows warning for projected overspending', async ({ page }) => {
    await page.getByRole('button', { name: 'Project' }).first().click();
    
    // This assumes you have events that would cause overspending
    // You might need to create these events first
    await expect(page.getByText(/Warning: Projected spending exceeds cap/)).toBeVisible();
  });

  test('maintains projection in URL', async ({ page }) => {
    await page.getByRole('button', { name: 'Project' }).first().click();
    
    // Get the current URL
    const url = new URL(page.url());
    expect(url.hash).toMatch(/^#projection=/);

    // Change the date
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.getByRole('textbox', { type: 'date' }).fill(nextMonth.toISOString().split('T')[0]);
    
    // Verify URL updates
    const newUrl = new URL(page.url());
    expect(newUrl.hash).toMatch(nextMonth.toISOString().split('T')[0]);
  });
});
