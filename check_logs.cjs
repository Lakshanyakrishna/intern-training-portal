const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[Browser PageError]: ${err.toString()}`);
  });

  console.log('Navigating to http://localhost:5174/opportunities ...');
  await page.goto('http://localhost:5174/opportunities', { waitUntil: 'networkidle0' });
  
  // Wait a couple of seconds to let animations run
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
  console.log('Done.');
})();
