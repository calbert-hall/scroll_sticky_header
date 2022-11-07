'use strict';

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Eyes, ClassicRunner, Target, RectangleSize, Configuration, BatchInfo} = require('@applitools/eyes-selenium');

describe('Red Cross - Classic Runner', function () {
  let runner, eyes, driver;

  before(async () => {
    // Initialize the Runner for your test.
    runner = new ClassicRunner();

    // Initialize the eyes SDK (IMPORTANT: make sure your API key is set in the APPLITOOLS_API_KEY env variable).
    eyes = new Eyes(runner);

    // Initialize the eyes configuration.
    let conf = new Configuration()

    // set new batch
    conf.setBatch(new BatchInfo("Classic Runner"));

    // set the configuration to eyes
    eyes.setConfiguration(conf)

    // Use Chrome browser
    const options = new chrome.Options();
    if (process.env.CI === 'true') options.headless();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });


  beforeEach(async function() {
    await eyes.open(driver, 'Red Cross', this.currentTest.title, new RectangleSize(1200, 800));
  });

  it('Sticky Header validation', async function() {
    // Start the test by setting AUT's name, test name and viewport size (width X height)
    await console.log("this test: " + this.test);
    await console.log("this test title: " + this.test.title);

    // Navigate the browser to the "ACME" demo app.
    await driver.get("https://develop.aem.dev.redcross.us");

    await eyes.check("Main page", Target.window());
    await driver.executeScript( "window.scrollBy(0, 500)");

    // Visual checkpoint #1 - Check the login page.
    await eyes.check("Scrolled", Target.window());

  });

  afterEach(async () => {
    await eyes.close();
  });

  after(async () => {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called, ends the test as aborted.
    await eyes.abort();

    // Wait and collect all test results
    const allTestResults = await runner.getAllTestResults(false);
    console.log(allTestResults);
  });
});
