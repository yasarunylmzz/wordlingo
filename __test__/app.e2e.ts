import { device, element, by, expect } from "detox";

describe("Login Flow", () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true });
  });

  it("should show entry screen with Log In and Sign In buttons", async () => {
    await expect(element(by.id("login-choice-button"))).toBeVisible();
    await expect(element(by.id("signup-choice-button"))).toBeVisible();
  });

  it("should show login screen", async () => {
    await expect(element(by.id("login-title"))).toBeVisible();
  });

  it("should type email and password", async () => {
    await element(by.id("email-input")).typeText("yasarunylmzz@gmail.com");
    await element(by.id("password-input")).typeText("12345");
    await element(by.id("login-button")).tap();
  });

  it("should tap login button and see home screen", async () => {
    await expect(element(by.id("home-screen"))).toBeVisible();
  });
});
