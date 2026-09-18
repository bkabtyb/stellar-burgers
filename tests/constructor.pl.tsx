import { test, expect } from '@playwright/test';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '/api/ingredients',
      update: false
    });

    const ingredientsResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/ingredients') && response.status() === 200
    );

    await page.goto('/');

    await ingredientsResponse;
  });

  test('adds an ingredient to the constructor', async ({ page }) => {
    const ingredient = page.getByText('Флюоресцентная булка R2-D3').first();

    await expect(ingredient).toBeVisible();

    const ingredientCard = ingredient.locator('xpath=../..');

    await ingredientCard
      .getByRole('button', {
        name: 'Добавить'
      })
      .click();

    await expect(
      page.getByText('Флюоресцентная булка R2-D3 (верх)')
    ).toBeVisible();

    await expect(
      page.getByText('Флюоресцентная булка R2-D3 (низ)')
    ).toBeVisible();
  });

  test('opens ingredient details modal', async ({ page }) => {
    const ingredient = page.getByText('Флюоресцентная булка R2-D3').first();

    await expect(ingredient).toBeVisible();

    await ingredient.click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    await expect(modal.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
  });

  test('closes ingredient details modal', async ({ page }) => {
    const ingredient = page.getByText('Флюоресцентная булка R2-D3').first();

    await expect(ingredient).toBeVisible();

    await ingredient.click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    await modal.getByRole('button').click();

    await expect(modal).not.toBeVisible();
  });
});

test('creates an order and clears the constructor', async ({
  page,
  context
}) => {
  // Фейковые токены
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fake-access-token',
      domain: 'norma.education-services.ru',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  // Фейковый авторизованный пользователь
  await page.route('/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });
  });

  // Фейковое создание заказа
  await page.route('/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Флюоресцентный бургер',
        order: {
          number: 12345,
          name: 'Флюоресцентный бургер',
          status: 'done'
        }
      })
    });
  });

  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');

    // Ждём появления ингредиентов
    const bun = page
      .getByText('Флюоресцентная булка R2-D3')
      .first();

    await expect(bun).toBeVisible();

    // Добавляем булку
    const bunCard = bun.locator('xpath=../..');

    await bunCard.getByRole('button', {
      name: 'Добавить'
    }).click();

    // Добавляем начинку
    const filling = page
      .getByText('Биокотлета из марсианской Магнолии')
      .first();

    await expect(filling).toBeVisible();

    const fillingCard = filling.locator('xpath=../..');

    await fillingCard.getByRole('button', {
      name: 'Добавить'
    }).click();

    // Проверяем булку
    await expect(
      page.getByText('Флюоресцентная булка R2-D3 (верх)')
    ).toBeVisible();

    await expect(
      page.getByText('Флюоресцентная булка R2-D3 (низ)')
    ).toBeVisible();

    // Проверяем начинку
    await expect(
      page
        .locator('span.constructor-element__text')
        .filter({
          hasText: 'Биокотлета из марсианской Магнолии'
        })
    ).toBeVisible();

    // Нажимаем оформить заказ
    await page.getByRole('button', {
      name: 'Оформить заказ'
    }).click();

    // Ждём модалку
    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    // Проверяем номер заказа
    await expect(
      modal.getByText('12345')
    ).toBeVisible();

    // Проверяем очистку конструктора
    await expect(
      page.getByText('Выберите булки')
    ).toHaveCount(2);

    await expect(
      page.getByText('Выберите начинку')
    ).toBeVisible();

    // Закрываем модалку
    await modal.getByRole('button').click();

    await expect(modal).not.toBeVisible();
  });

