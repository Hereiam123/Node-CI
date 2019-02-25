const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("we can see blog creation form", async () => {
    const text = await page.getContentsOf("form .title label");
    expect(text).toEqual("Blog Title");
  });

  describe("using invlaid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button.btn-flat.right");
    });
    test("form shows error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});
