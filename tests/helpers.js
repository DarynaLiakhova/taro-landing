const path = require('path');
const { pathToFileURL } = require('url');
const PAGE = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const isPhone = (page) => page.viewportSize().width <= 760;

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(PAGE);
  await page.waitForLoadState('load');
  return errors;
}
module.exports = { open, isPhone };
