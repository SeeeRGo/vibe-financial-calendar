import { test, expect } from '@playwright/test';

test.describe('Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Sign in (you'll need to implement this based on your auth setup)
  });

  test('creates a new event', async ({ page }) => {
    // Click on a date in the calendar
    await page.getByRole('gridcell', { name: /15/ }).click();

    await page.getByPlaceholder('Event Title').fill('Test Event');
    await page.getByPlaceholder('Amount').fill('500');
    await page.getByRole('combobox', { name: 'type' }).selectOption('expense');
    await page.getByRole('combobox', { name: 'categoryId' }).selectOption({ label: /Test Category/ });
    await page.getByPlaceholder('Description').fill('Test Description');
    await page.getByRole('button', { name: 'Add Event' }).click();

    await expect(page.getByText('Test Event ($500)')).toBeVisible();
  });

  test('creates a recurring event', async ({ page }) => {
    await page.getByRole('gridcell', { name: /15/ }).click();

    await page.getByPlaceholder('Event Title').fill('Recurring Event');
    await page.getByPlaceholder('Amount').fill('100');
    await page.getByRole('combobox', { name: 'type' }).selectOption('expense');
    await page.getByRole('combobox', { name: 'categoryId' }).selectOption({ label: /Test Category/ });
    await page.getByRole('checkbox', { name: 'Recurring Event' }).check();
    await page.getByRole('combobox', { name: 'frequency' }).selectOption('monthly');
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.getByRole('textbox', { name: 'endDate' }).fill(nextMonth.toISOString().split('T')[0]);
    
    await page.getByRole('button', { name: 'Add Event' }).click();

    await expect(page.getByText('Recurring Event ($100)')).toBeVisible();
  });

  test('edits an existing event', async ({ page }) => {
    await page.getByText('Test Event ($500)').click();
    await page.getByPlaceholder('Event Title').fill('Updated Event');
    await page.getByPlaceholder('Amount').fill('600');
    await page.getByRole('button', { name: 'Update Event' }).click();

    await expect(page.getByText('Updated Event ($600)')).toBeVisible();
  });

  test('disables and enables an event', async ({ page }) => {
    await page.getByText('Test Event ($500)').click();
    await page.getByRole('button', { name: 'Disable' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    // Check that the event is visually dimmed
    await expect(page.locator('.opacity-50')).toBeVisible();

    // Re-enable the event
    await page.getByText('Test Event ($500)').click();
    await page.getByRole('button', { name: 'Enable' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    // Check that the event is no longer dimmed
    await expect(page.locator('.opacity-50')).not.toBeVisible();
  });

  test('deletes an event', async ({ page }) => {
    await page.getByText('Test Event ($500)').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Test Event ($500)')).not.toBeVisible();
  });

  test('drags and drops an event', async ({ page }) => {
    const event = page.getByText('Test Event ($500)');
    const targetDate = page.getByRole('gridcell', { name: /16/ });
    
    await event.dragTo(targetDate);
    
    // Verify the event moved
    await expect(targetDate.getByText('Test Event ($500)')).toBeVisible();
  });
});
