// Компьютер: картина с табличкой, плитки, ступени в ряд
const { test, expect } = require('@playwright/test');
const { open, isPhone } = require('./helpers');

test.beforeEach(async ({ page }) => {
  test.skip(isPhone(page), 'только для компьютера');
  await open(page);
});

test('виден горизонтальный первый экран, мобильный скрыт', async ({ page }) => {
  await expect(page.locator('.fs')).toBeVisible();
  await expect(page.locator('.mfs')).toBeHidden();
});

test('заголовок на табличке ровно в две строки и не наезжает на подзаголовок', async ({ page }) => {
  const t = page.locator('.plq-t');
  const lines = await t.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
  expect(lines).toBe(2);
  const tb = await t.boundingBox();
  const sb = await page.locator('.plq-s').boundingBox();
  const bb = await page.locator('.plq-b').boundingBox();
  expect(tb.y + tb.height).toBeLessThanOrEqual(sb.y);
  expect(sb.y + sb.height).toBeLessThanOrEqual(bb.y);
});

test('табличка и плитки помещаются в первый экран', async ({ page }) => {
  const vh = page.viewportSize().height;
  for (const sel of ['.plq-b', '.tile >> nth=3']) {
    const b = await page.locator(sel).boundingBox();
    expect(b.y + b.height).toBeLessThanOrEqual(vh);
  }
});

test('плитка «Стоимость» прокручивает к ценам', async ({ page }) => {
  await page.locator('.tile', { hasText: 'Стоимость' }).click();
  await expect(page.locator('#price')).toBeInViewport();
});

test('ступени: клик по карте показывает её описание', async ({ page }) => {
  await page.locator('#stg .stg').nth(2).click();
  await expect(page.locator('#sdet h3')).toHaveText('Придворные арканы');
  await expect(page.locator('#mpath')).toBeHidden();
});

test('бургер скрыт, меню разделов видно', async ({ page }) => {
  await expect(page.locator('.burger')).toBeHidden();
  await expect(page.locator('.nav')).toBeVisible();
});
