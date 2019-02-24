const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
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

test("When signed in, shows log out button", async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual("Logout");
});
