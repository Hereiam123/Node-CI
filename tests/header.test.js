const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", el => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Click on Google Login link and goes to Google Oauth", async () => {
  await page.click(".right a");
  const pageUrl = page.url();
  expect(pageUrl).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logged out button", async () => {
  const id = "5c677a7d56e7fd228c098814";

  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual("Logout");
});
