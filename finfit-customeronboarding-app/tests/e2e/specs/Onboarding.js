const Onboarding = {
  email: 'dileep524@gmail.com',
  phone: '7799482361',
  waitTime: 2000,
  notUkCustomer: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/div[2]/div/div/div/div/div[2]/button', 5000)
      .pause(3000)
      .useXpath()
      .click('//*[@id="app"]/div/div[2]/div/div/div/div/div[2]/button');
  },
  ukCustomer: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/div[2]/div/div/div/div/div[1]/button', 5000)
      .useXpath()
      .click('//*[@id="app"]/div/div[2]/div/div/div/div/div[1]/button')
      .pause(5000);
  },
  enterCredentials: (browser, email, phone) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/div[3]/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/div[3]/div[2]/button')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@data-qa="email"]', 3000)
      .useXpath()
      .setValue('//*[@data-qa="email"]', email)
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@data-qa="phone number"]', 1000)
      .useXpath()
      .setValue('//*[@data-qa="phone number"]', phone)
      .pause(1000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/div[2]/div/div/form/div/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/div[2]/div/div/form/div/button')
      .pause(4000);
  },
  enterOTP: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@data-qa="otp"]', 2000)
      .useXpath()
      .setValue('//*[@data-qa="otp"]', '123456')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/div[2]/div/div/div/div[3]/div/div/div[1]/div/div', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/div[2]/div/div/div/div[3]/div/div/div[1]/div/div')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div[3]/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div[3]/div/div/div[2]/button')
      .pause(5000)
      .useXpath()
      .waitForElementVisible('//*[contains(text(), "Get Started")]', 2000)
      .useXpath()
      .click('//*[contains(text(), "Get Started")]')
      .pause(2000);
  },
  existingProspect: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div[2]/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div[2]/div/div/div[2]/button')
      .pause(1000);
  },
  existingCustomer: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div[2]/div/div/div[2]/button[1]', 2000)
      .useXpath()
      .click('//*[@id="app"]/div[2]/div/div/div[2]/button[1]')
      .pause(1000);
  },
  personalDetails: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@data-qa="firstName"]', 5000)
      .useXpath()
      .setValue('//*[@data-qa="firstName"]', 'Dileep')
      .pause(2000)
      .useXpath()
      .setValue('//*[@data-qa="lastName"]', 'Reddy')
      .useXpath()
      .setValue('(//*[@id="required"])[3]', '27-01-1996')
      .pause(3000)
      .useXpath()
      .waitForElementVisible('//*[@id="form-base"]/div[4]/div/div/div[1]/div[1]/div[1]', 1000)
      .useXpath()
      .click('//*[@id="form-base"]/div[4]/div/div/div[1]/div[1]/div[1]')
      .pause(3000)
      .useXpath()
      .click("//*[contains(text(), 'Passport')]")
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@data-qa="nationalId"]', 2000)
      .useXpath()
      .setValue('//*[@data-qa="nationalId"]', 'INDaad')
      .pause(3000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button')
      .pause(3000);
  },
  addressDetails: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@data-qa="postCode"]', 2000)
      .useXpath()
      .setValue('//*[@data-qa="postCode"]', 'CB62AG')
      .pause(3000)
      .useXpath()
      .click('//*[@id="search"]')
      .pause(3000)
      .useXpath()
      .click("//*[contains(text(), '234')]")
      .pause(3000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button')
      .pause(3000);
  },
  additionalInformation: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('(//*[@id="required"])', 2000)
      .useXpath()
      .setValue('(//*[@id="required"])', '123123')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('(//*[@id="required"])[2]', 2000)
      .useXpath()
      .setValue('(//*[@id="required"])[2]', '99999999')
      .pause(1000)
      .useXpath()
      .waitForElementVisible('(//*[@id="required"])[3]', 2000)
      .useXpath()
      .setValue('(//*[@id="required"])[3]', 'hd798798i')
      .pause(5000)
      .useXpath()
      .waitForElementVisible('//*[@id="form-base"]/div[3]/div/div/div[1]/div/div', 2000)
      .useXpath()
      .click('//*[@id="form-base"]/div[3]/div/div/div[1]/div/div')
      .pause(1000)
      .useXpath()
      .waitForElementVisible('//*[@id="form-base"]/div[4]/div/div/div[1]/div/div', 2000)
      .useXpath()
      .click('//*[@id="form-base"]/div[4]/div/div/div[1]/div/div')
      .useXpath()
      .waitForElementVisible('(//*[@id="required"])[4]', 2000)
      .useXpath()
      .setValue('(//*[@id="required"])[4]', '913806496')
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button')
      .pause(3000);
  },
  reviewAndConsent: (browser) => {
    browser
      .assert.containsText('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[1]/div/div[1]/div[1]', 'Dileep Reddy')
      .pause(2000)
      .assert.containsText('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[1]/div/div[1]/div[2]', '27 - 01 - 1996')
      .pause(2000)
      .assert.containsText('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[1]/div/div[4]/div[1]', '12-31-23')
      .pause(2000)
      .assert.containsText('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[1]/div/div[3]/div[2]', 'United Kingdom')
      .pause(2000)
      .assert.containsText('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[1]/div/div[4]/div[2]', '99999999')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[2]/div/div/div/div/div[1]/div[1]/div/div[1]/div/div', 3000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[6]/div/div/div/div/main/div/div/div/div/div[2]/div/div/div/div/div[1]/div[1]/div/div[1]/div/div')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="stickyContent"]/div[1]/main/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div/div/div[1]/div/div', 3000)
      .useXpath()
      .click('//*[@id="stickyContent"]/div[1]/main/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div/div/div[1]/div/div')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="stickyContent"]/div[1]/main/div/div/div/div/div[3]/div/div/div/div/div/div/div[1]/div/div[1]/div/div', 3000)
      .useXpath()
      .click('//*[@id="stickyContent"]/div[1]/main/div/div/div/div/div[3]/div/div/div/div/div/div/div[1]/div/div[1]/div/div')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button')
      .pause(3000);
  },
  credentials: (browser) => {
    browser
      .useXpath()
      .waitForElementVisible('//*[@data-qa="password"]', 2000)
      .useXpath()
      .setValue('//*[@data-qa="password"]', 'P@@@ssw012RD')
      .pause(2000)
      .useXpath()
      .waitForElementVisible('//*[@data-qa="confirmPassword"]', 4000)
      .useXpath()
      .setValue('//*[@data-qa="confirmPassword"]', 'P@@@ssw012RD')
      .useXpath()
      .waitForElementVisible('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button', 2000)
      .useXpath()
      .click('//*[@id="app"]/div/main/div/div/div/div[2]/div/div[8]/div/div/footer/div/div/div/div[2]/button')
      .pause(3000)
      .useXpath()
      .waitForElementVisible('//*[contains(text(), "OK")]', 2000)
      .useXpath()
      .click('//*[contains(text(), "OK")]')
      .pause(2000);
  },
};

module.exports = {

  'Not a UK resident': (browser) => {
    browser
      .url(`${process.env.VUE_DEV_SERVER_URL}dco/termdeposit/111/10`)
      .waitForElementVisible('#app', 5000);
    Onboarding.notUkCustomer(browser);
    browser.pause(2000);
    browser
      .useXpath()
      .assert.containsText('//*[@id="app"]/div/div[2]/div/div/div/div/div[1]/font', 'I\'m not a UK resident');
    browser.end();
  },

  'New Prospect Login': (browser) => {
    browser
      .url(`${process.env.VUE_DEV_SERVER_URL}dco/termdeposit/96170InternalEUR/12`);
    Onboarding.ukCustomer(browser);
    Onboarding.enterCredentials(browser, 'dileep524@gmail.com', '7799482361');
    Onboarding.enterOTP(browser);
    Onboarding.personalDetails(browser);
    Onboarding.addressDetails(browser);
    Onboarding.additionalInformation(browser);
    Onboarding.reviewAndConsent(browser);
    Onboarding.credentials(browser);
    browser.pause(5000)
      .end();
  },

  'Existing Prospect Login': (browser) => {
    browser
      .url(`${process.env.VUE_DEV_SERVER_URL}dco/termdeposit/96170InternalEUR/12`);
    Onboarding.ukCustomer(browser);
    Onboarding.enterCredentials(browser, 'prospect@gmail.com', '9899999999');
    Onboarding.enterOTP(browser);
    Onboarding.existingProspect(browser);
    browser.pause(5000)
      .end();
  },

  'Existing Customer Login': (browser) => {
    browser
      .url(`${process.env.VUE_DEV_SERVER_URL}dco/termdeposit/111/10`);
    Onboarding.ukCustomer(browser);
    Onboarding.enterCredentials(browser, 'customer@gmail.com', '9899999999');
    Onboarding.enterOTP(browser);
    Onboarding.existingCustomer(browser);
    browser.pause(8000)
      .end();
  },
};
