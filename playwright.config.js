// Тесты лендинга «Путь Таролога». Запуск: npm test
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'ноутбук 1366', use: { viewport: { width: 1366, height: 768 } } },
    { name: 'монитор 1920', use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'телефон 390', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'маленький телефон 360', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 640 } } },
  ],
});
