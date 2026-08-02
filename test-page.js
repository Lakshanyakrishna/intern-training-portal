import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', async msg => {
    const args = await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => arg.toString())));
    console.log('PAGE LOG:', msg.type(), ...args);
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message, error.stack));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
  );

  try {
    await page.goto('http://localhost:5175/opportunities', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.log('Nav error:', e);
  }

  await browser.close();
})();
