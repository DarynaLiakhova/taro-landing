// Телефон: вертикальный фон с плашкой, бургер, ступени картами
const { test, expect } = require('@playwright/test');
const { open, isPhone } = require('./helpers');

test.beforeEach(async ({ page }) => {
  test.skip(!isPhone(page), 'только для телефона');
  await open(page);
});

test('виден вертикальный первый экран на всю высоту', async ({ page }) => {
  await expect(page.locator('.mfs')).toBeVisible();
  await expect(page.locator('.fs')).toBeHidden();
  const b = await page.locator('.mfs').boundingBox();
  const vh = page.viewportSize().height;
  expect(Math.abs(b.y + b.height - Math.max(vh, 64 + 480))).toBeLessThanOrEqual(80);
});

test('плашка с кнопкой и ссылки разделов целиком в первом экране', async ({ page }) => {
  const vh = page.viewportSize().height;
  const card = await page.locator('.mfs-c').boundingBox();
  const nav = await page.locator('.mfs-n').boundingBox();
  expect(card.y).toBeGreaterThanOrEqual(64);
  expect(card.y + card.height).toBeLessThanOrEqual(nav.y);
  expect(nav.y + nav.height).toBeLessThanOrEqual(Math.max(vh, 64 + 480));
});

test('бургер открывает меню и закрывает после выбора пункта', async ({ page }) => {
  const menu = page.locator('#menu');
  await expect(menu).toBeHidden();
  await page.locator('.burger').click();
  await expect(menu).toBeVisible();
  await expect(page.locator('.burger')).toHaveAttribute('aria-expanded', 'true');
  await menu.getByRole('link', { name: 'Стоимость' }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#price')).toBeInViewport();
});

test('ступени показаны картами по одной, старый ряд скрыт', async ({ page }) => {
  await expect(page.locator('#stg')).toBeHidden();
  await expect(page.locator('#sdet')).toBeHidden();
  await expect(page.locator('#mpath .flip')).toHaveCount(7);
});

test('карта переворачивается по нажатию и обратно', async ({ page }) => {
  const card = page.locator('#mpath .flip').nth(1);
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600); // даём закончиться подсказке-перевороту первой карты
  await card.click({ position: { x: 40, y: 40 } });
  await expect(card).toHaveClass(/on/);
  await card.click({ position: { x: 40, y: 40 } });
  await expect(card).not.toHaveClass(/on/);
});

test('купить можно только I ступень, у остальных замок', async ({ page }) => {
  const cards = page.locator('#mpath .fc-b');
  await expect(cards.nth(0).locator('a.btn')).toHaveCount(1);
  for (let i = 1; i < 7; i++) {
    await expect(cards.nth(i).locator('a.btn')).toHaveCount(0);
    await expect(cards.nth(i).locator('.lk')).toHaveCount(1);
  }
});

test('кнопка «Лекции» открывает шторку со списком, крестик закрывает', async ({ page }) => {
  const card = page.locator('#mpath .flip').nth(2);
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600);
  await card.click({ position: { x: 40, y: 40 } });
  await card.locator('[data-l]').click();
  const sheet = page.locator('#msheet');
  await expect(sheet).toHaveClass(/on/);
  await expect(sheet.locator('h3')).toHaveText('Придворные арканы');
  await expect(sheet.locator('.topics li')).toHaveCount(9);
  await sheet.locator('.close').click();
  await expect(sheet).not.toHaveClass(/on/);
});
