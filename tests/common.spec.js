// Проверки для всех размеров экрана
const { test, expect } = require('@playwright/test');
const { open } = require('./helpers');

test('страница открывается без ошибок в коде', async ({ page }) => {
  const errors = await open(page);
  await expect(page).toHaveTitle('Путь Таролога');
  expect(errors).toEqual([]);
});

test('нет горизонтальной прокрутки', async ({ page }) => {
  await open(page);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(over).toBeLessThanOrEqual(1);
});

test('все картинки загрузились', async ({ page }) => {
  const bad = [];
  page.on('response', (r) => { if (r.status() >= 400) bad.push(r.url()); });
  page.on('requestfailed', (r) => { if (!r.url().startsWith('https://fonts')) bad.push(r.url()); });
  await open(page);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  });
  expect(bad).toEqual([]);
});

test('ссылки-якоря ведут на существующие разделы', async ({ page }) => {
  await open(page);
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h.length > 1 && !document.querySelector(h)));
  expect(missing).toEqual([]);
});

test('порядок блоков: ступени сразу после первого экрана', async ({ page }) => {
  await open(page);
  const ids = await page.$$eval('main > section', (s) => s.map((x) => x.id));
  expect(ids).toEqual(['stages', 'for', 'result', 'lena', 'how', 'price', 'reviews', 'faq']);
});

test('вопросы раскрываются и закрываются', async ({ page }) => {
  await open(page);
  const q = page.locator('.faq details').first();
  await q.locator('summary').click();
  await expect(q).toHaveAttribute('open', '');
  await q.locator('summary').click();
  await expect(q).not.toHaveAttribute('open', '');
});
