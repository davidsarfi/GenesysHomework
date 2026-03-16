# SauceDemo Test Plan

## 1. Introduction

**Application Under Test:** SauceDemo (https://www.saucedemo.com/)
**Description:** SauceDemo is a sample e-commerce web application (Swag Labs) used for testing and training purposes. It simulates an online store where users can browse products, add items to a shopping cart, and complete a checkout flow.
**Test Framework:** Playwright with TypeScript
**Test Architecture:** Page Object Model (POM)

---

## 2. Scope

### In Scope
- Login functionality (all user types, validation, error handling)
- Product inventory page (display, sorting, cart interactions)
- Product detail page (view details, add/remove from cart, navigation)
- Shopping cart (item management, quantities, prices, navigation)
- Checkout flow (form validation, order review, purchase completion)
- Menu and navigation (logout, reset app state)
- Footer (copyright text, social media links)
- Cross-user purchase flows (standard, performance_glitch, visual users)

### Out of Scope
- Performance/load testing
- Security testing (XSS, injection, etc.)
- Accessibility compliance (WCAG)
- Cross-browser testing (covered by Playwright config, not by test logic)
- API-level testing of the SauceDemo backend

---

## 3. Test Environment

| Component        | Detail                          |
|------------------|---------------------------------|
| URL              | https://www.saucedemo.com/      |
| Browser          | Chromium (headed mode)          |
| Viewport         | 1280x720                        |
| Test Timeout     | 30 seconds                      |
| Assertion Timeout| 5 seconds                       |
| Slowdown         | 500ms                           |

---

## 4. Test Users

All accounts use the password: `secret_sauce`

| Username                  | Behavior                                                      | Can Complete Purchase |
|---------------------------|---------------------------------------------------------------|----------------------|
| `standard_user`           | Normal behavior, full functionality                           | Yes                  |
| `locked_out_user`         | Login blocked with error message                              | No (cannot login)    |
| `problem_user`            | Intentional bugs: wrong images, broken sort, checkout issues  | No (checkout broken) |
| `performance_glitch_user` | Slow page loading, delayed responses                          | Yes                  |
| `visual_user`             | Visual inconsistencies for regression testing                 | Yes                  |
| `error_user`              | Error handling and recovery scenarios                         | No (errors on actions)|

---

## 5. Page Objects

| Page Object            | File                            | Responsibility                                       |
|------------------------|---------------------------------|------------------------------------------------------|
| `LoginPage`            | `pages/saucedemo/LoginPage.ts`            | Login form, validation errors, error dismissal       |
| `InventoryPage`        | `pages/saucedemo/InventoryPage.ts`        | Product listing, sorting, cart, menu, footer, social |
| `InventoryItemPage`    | `pages/saucedemo/InventoryItemPage.ts`    | Product detail view, add/remove cart, back navigation|
| `CartPage`             | `pages/saucedemo/CartPage.ts`             | Cart items, remove, quantities, prices, navigation   |
| `CheckoutStepOnePage`  | `pages/saucedemo/CheckoutStepOnePage.ts`  | Checkout info form, validation, cancel               |
| `CheckoutStepTwoPage`  | `pages/saucedemo/CheckoutStepTwoPage.ts`  | Order review, totals, finish, cancel                 |
| `CheckoutCompletePage` | `pages/saucedemo/CheckoutCompletePage.ts` | Order confirmation, back home                        |

---

## 6. Test Cases

### 6.1 Login (12 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 1 | Login with `standard_user`                       | High     | Redirects to inventory, title shows "Products"                           |
| 2 | Login with `locked_out_user`                     | High     | Error: "Sorry, this user has been locked out."                           |
| 3 | Login with `performance_glitch_user`             | Medium   | Redirects to inventory (with delay), title shows "Products"              |
| 4 | Login with `problem_user`                        | Medium   | Redirects to inventory, title shows "Products"                           |
| 5 | Login with `visual_user`                         | Medium   | Redirects to inventory, title shows "Products"                           |
| 6 | Login with `error_user`                          | Medium   | Redirects to inventory, title shows "Products"                           |
| 7 | Login with invalid credentials                   | High     | Error: "Username and password do not match any user in this service"     |
| 8 | Login with valid username and wrong password      | High     | Error: "Username and password do not match any user in this service"     |
| 9 | Submit empty login form                          | High     | Error: "Username is required"                                            |
| 10| Submit with only username                        | High     | Error: "Password is required"                                            |
| 11| Submit with only password                        | High     | Error: "Username is required"                                            |
| 12| Dismiss error message                            | Low      | Error message disappears after clicking close button                     |

### 6.2 Inventory (13 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 13| Display 6 products                               | High     | Inventory page shows exactly 6 product items                             |
| 14| Page title shows "Products"                      | Low      | Title element contains text "Products"                                   |
| 15| Sort products by name A to Z                     | Medium   | Products are ordered alphabetically ascending                            |
| 16| Sort products by name Z to A                     | Medium   | Products are ordered alphabetically descending                           |
| 17| Sort products by price low to high               | Medium   | Products are ordered by price ascending                                  |
| 18| Sort products by price high to low               | Medium   | Products are ordered by price descending                                 |
| 19| Add item to cart, badge shows 1                  | High     | Cart badge displays "1" after adding one item                            |
| 20| Add multiple items, badge updates                | High     | Cart badge displays correct count (3) after adding 3 items               |
| 21| Remove item, badge disappears                    | High     | Cart badge is not visible after removing the only item                   |
| 22| Navigate to product detail page                  | Medium   | Product name, price, and description are visible on detail page          |
| 23| Navigate to detail and back to products          | Medium   | Clicking "Back to products" returns to inventory with correct title      |
| 24| Add to cart from product detail page              | High     | "Add to cart" button changes to "Remove" button                          |
| 25| Remove from cart on product detail page           | Medium   | "Remove" button changes back to "Add to cart" button                     |

### 6.3 Cart (6 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 26| Added items appear with correct names            | High     | Cart displays correct item names and count matches items added           |
| 27| Remove item from cart page                       | High     | Item is removed, count decreases, item no longer listed                  |
| 28| Continue shopping returns to inventory            | Medium   | Clicking "Continue Shopping" navigates back to inventory page            |
| 29| Cart shows correct quantities                    | Medium   | Each item shows quantity of "1"                                          |
| 30| Empty cart shows no items                        | Low      | Cart page with no items added shows 0 items                             |
| 31| Cart prices match inventory prices               | High     | Sauce Labs Backpack price is "$29.99" in cart                            |

### 6.4 Checkout (7 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 32| Checkout validation - all fields empty           | High     | Error: "First Name is required"                                          |
| 33| Checkout validation - missing last name          | High     | Error: "Last Name is required"                                           |
| 34| Checkout validation - missing postal code        | High     | Error: "Postal Code is required"                                         |
| 35| Cancel checkout returns to cart                  | Medium   | Navigates back to cart, items are preserved                              |
| 36| Checkout overview shows correct items            | High     | Both added items appear in the order summary                             |
| 37| Checkout overview displays subtotal, tax, total  | High     | Subtotal shows "$29.99", tax and total are visible                       |
| 38| Cancel on checkout overview returns to inventory | Medium   | Navigates back to inventory page                                         |

### 6.5 Complete Purchase Flow (4 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 39| Purchase single item end-to-end                 | Critical | "Thank you for your order!" header, confirmation text, and image visible |
| 40| Purchase multiple items end-to-end              | Critical | Cart badge shows 2, checkout completes with confirmation header          |
| 41| Back home after order returns to inventory       | Medium   | Clicking "Back Home" navigates to inventory with correct title           |
| 42| Cart is empty after completing purchase          | High     | Cart badge is not visible after returning to inventory post-purchase     |

### 6.6 Menu & Navigation (2 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 43| Logout returns to login page                    | High     | Login button is visible after logout                                     |
| 44| Reset app state clears cart                     | Medium   | After reset and page reload, cart badge is no longer visible             |

### 6.7 Footer (4 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 45| Footer contains copyright text                  | Low      | Footer includes "Terms of Service"                                       |
| 46| Twitter social link is visible                   | Low      | Twitter link element is visible in footer                                |
| 47| Facebook social link is visible                  | Low      | Facebook link element is visible in footer                               |
| 48| LinkedIn social link is visible                  | Low      | LinkedIn link element is visible in footer                               |

### 6.8 Purchase Flow with Different Users (3 tests)

| # | Test Case                                        | Priority | Expected Result                                                          |
|---|--------------------------------------------------|----------|--------------------------------------------------------------------------|
| 49| Complete purchase flow with `standard_user`      | Critical | Full checkout completes with "Thank you for your order!" confirmation    |
| 50| Complete purchase flow with `performance_glitch_user` | High | Full checkout completes (slower) with confirmation                       |
| 51| Complete purchase flow with `visual_user`        | Medium   | Full checkout completes with confirmation                                |

---

## 7. Test Summary

| Category                        | Test Count | Critical | High | Medium | Low |
|---------------------------------|------------|----------|------|--------|-----|
| Login                           | 12         | 0        | 6    | 4      | 2   |
| Inventory                       | 13         | 0        | 5    | 6      | 2   |
| Cart                            | 6          | 0        | 3    | 2      | 1   |
| Checkout                        | 7          | 0        | 4    | 3      | 0   |
| Complete Purchase Flow          | 4          | 2        | 1    | 1      | 0   |
| Menu & Navigation               | 2          | 0        | 1    | 1      | 0   |
| Footer                          | 4          | 0        | 0    | 0      | 4   |
| Purchase Flow (Different Users) | 3          | 1        | 1    | 1      | 0   |
| **Total**                       | **51**     | **3**    | **21**| **18**| **9**|

---

## 8. Execution

```bash
# Run all SauceDemo tests
npx playwright test tests/specs/saucedemo.spec.ts

# Run a specific test group
npx playwright test tests/specs/saucedemo.spec.ts -g "Login"
npx playwright test tests/specs/saucedemo.spec.ts -g "Inventory"
npx playwright test tests/specs/saucedemo.spec.ts -g "Cart"
npx playwright test tests/specs/saucedemo.spec.ts -g "Checkout"
npx playwright test tests/specs/saucedemo.spec.ts -g "Complete Purchase Flow"
npx playwright test tests/specs/saucedemo.spec.ts -g "Menu"
npx playwright test tests/specs/saucedemo.spec.ts -g "Footer"
npx playwright test tests/specs/saucedemo.spec.ts -g "Purchase flow with different users"

# Run in debug mode
npx playwright test tests/specs/saucedemo.spec.ts --debug
```

---

## 9. Known Limitations

- **`problem_user`** is not included in the end-to-end purchase flow tests because this user has intentional bugs (broken checkout form, wrong product images, non-functional sort) that prevent completing a purchase.
- **`error_user`** is excluded from purchase flow tests because actions trigger application errors mid-flow.
- **`locked_out_user`** cannot log in at all, so only the login error test applies.
- The "Reset App State" feature only resets stored data but does not refresh the page DOM, so a page reload is required after reset to observe the change in the UI.
- Social media link destinations (Twitter, Facebook, LinkedIn) are verified for visibility only, not for correct URL navigation to external sites.
