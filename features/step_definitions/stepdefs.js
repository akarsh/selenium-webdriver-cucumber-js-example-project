const { Given, When, Then, AfterAll } = require("@cucumber/cucumber");
const webdriver = require("selenium-webdriver");
const assert = require("assert");
const http2 = require("node:http2");

// Local development test
// let driver = new Builder()
//   .forBrowser("chrome")
//   .setChromeOptions(new chrome.Options().headless())
//   .build();

let driver = new webdriver.Builder()
  .forBrowser(webdriver.Browser.CHROME)
  .usingServer("http://localhost:4444/wd/hub")
  .build();

function isConnected(string) {
  return new Promise((resolve) => {
    const client = http2.connect("https://" + string);
    client.on("connect", () => {
      resolve(true);
      client.destroy();
    });
    client.on("error", () => {
      resolve(false);
      client.destroy();
    });
  });
}

Given("The website {string} is available", async function (string) {
  return await isConnected(string);
});

When("I navigate to {string}", async function (string) {
  return await driver.get("https://" + string);
});

Then(
  "the page title should start with {string}",
  { timeout: 60 * 1000 },
  async function (string) {
    return assert((await driver.getTitle()) == "Akarsh SEGGEMU");
  }
);

AfterAll(async function () {
  await driver.quit();
});
