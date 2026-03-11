# Playwright TypeScript Starter

This project is set up for a homework assignment with the following preconditions:
- Node.js 18 or newer
- Playwright 1.39.0
- TypeScript

## Getting started

```bash
npm install
npx playwright install
npm run test       # run Playwright tests
npm run test:debug # run in debug mode
```

Tests are located under the `tests` folder and the configuration is in `playwright.config.ts`.

## Notes

No separate REST API library (e.g. Axios, SuperTest) was added on purpose. Playwright provides a built-in `request` fixture (`APIRequestContext`) with full support for GET, POST, PUT, DELETE, etc., making an additional library unnecessary.

## Locator Strategy

Locators follow the [Playwright best practices](https://playwright.dev/docs/best-practices#use-locators) priority order:

1. **`getByRole`** — preferred whenever an accessible role and name are available (e.g. `getByRole('textbox', { name: 'Username' })`)
2. **`data-test` attributes** — used as a fallback when elements lack a meaningful accessible role (e.g. `[data-test="shopping-cart-badge"]`)
3. **CSS / attribute selectors** — used only when neither of the above applies (e.g. targeting an iframe by `src`)
