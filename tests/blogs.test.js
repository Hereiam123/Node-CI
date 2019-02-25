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

  describe("using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "Hello");
      await page.type(".content input", "Hello");
      await page.click("form button.btn-flat.right");
    });

    test("Submitting takes user to review page", async () => {
      const headerText = await page.getContentsOf("form h5");
      expect(headerText).toEqual("Please confirm your entries");
    });

    test("Submitting adds blog to index page", async () => {
      await page.click("button.green.btn-flat");
      await page.waitFor(".card");
      const cardTitle = await page.getContentsOf(".card-content .card-title");
      const cardParagraph = await page.getContentsOf(".card-content p");
      expect(cardTitle).toEqual("Hello");
      expect(cardParagraph).toEqual("Hello");
    });
  });

  describe("using invalid inputs", async () => {
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

describe("When not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs"
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "T",
        content: "C"
      }
    }
  ];

  test("Blog actions are prohibited", async () => {
    const results = await page.execRequests(actions);
    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });

  // test("cannot create blog post", async () => {
  //   const result = await page.post("/api/blogs/", {
  //     title: "My Title",
  //     content: "My Content"
  //   });
  //   expect(result).toEqual({ error: "You must log in!" });
  // });

  // test("cannot get blog list", async () => {
  //   const result = await page.get("/api/blogs");
  //   expect(result).toEqual({ error: "You must log in!" });
  // });
});
