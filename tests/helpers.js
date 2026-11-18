const path = require('path');
const { pathToFileURL } = require('url');
const PAGE = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const isPhone = (page) => page.viewportSize().width <= 760;

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // THEME_LOCAL=путь/к/theme.css — проверить лендинг с локальной общей темой, не дожидаясь выкладки
  if (process.env.THEME_LOCAL) await page.route('**/taro-platform/theme.css', (r) => r.fulfill({ path: process.env.THEME_LOCAL, contentType: 'text/css' }));
  await page.goto(PAGE);
  await page.waitForLoadState('load');
  return errors;
}
module.exports = { open, isPhone };
