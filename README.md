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
