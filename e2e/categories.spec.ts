import { test, expect } from '@playwright/test';

test.describe('Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Sign in (you'll need to implement this based on your auth setup)
    await page.getByRole('button', { name: 'Manage Categories' }).click();
  });

  test('creates a new category', async ({ page }) => {
    await page.getByPlaceholder('Category Name').fill('Test Category');
    await page.getByRole('combobox', { name: 'type' }).selectOption('expense');
    await page.getByRole('checkbox', { name: 'Set Spending Cap' }).check();
    await page.getByPlaceholder('Cap Amount').fill('1000');
    await page.getByRole('combobox', { name: 'capPeriod' }).selectOption('monthly');
    await page.getByRole('button', { name: 'Add Category' }).click();

    await expect(page.getByText('Test Category')).toBeVisible();
  });

  test('edits an existing category', async ({ page }) => {
    await page.getByText('Test Category').click();
    await page.getByPlaceholder('Category Name').fill('Updated Category');
    await page.getByRole('button', { name: 'Update Category' }).click();

    await expect(page.getByText('Updated Category')).toBeVisible();
  });

  test('shows spending cap progress', async ({ page }) => {
    await expect(page.getByText(/remaining of \$1000/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Project' })).toBeVisible();
  });
});
