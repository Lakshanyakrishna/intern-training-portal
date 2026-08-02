import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5175/opportunities', { waitUntil: 'networkidle0' });
  const html = await page.content();
  if (html.includes('Something went wrong')) {
    console.log('ERROR IS PRESENT IN HTML');
  } else {
    console.log('SUCCESS: Page rendered properly. HTML snippet:');
    console.log(html.substring(0, 500)); // Print start of HTML
    // Let's also check if the specific H1 text is there
    if (html.includes('OPEN ROLES')) {
      console.log('OPEN ROLES is present on the page!');
    }
  }
  await browser.close();
})();
