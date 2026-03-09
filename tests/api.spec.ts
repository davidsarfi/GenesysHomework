import { test, expect } from '@playwright/test';

test('REST API - get users and validate response', async ({ request }) => {
  // 1. Send GET request to /users endpoint
  const response = await request.get('https://jsonplaceholder.typicode.com/users');

  // Verify response status is OK
  expect(response.ok()).toBeTruthy();

  // 2. Parse response to JSON
  const users = await response.json();

  // 3. Log names and emails
  for (const user of users) {
    console.log(`${user.name} | ${user.email}`);
  }

  // 4. Verify the first email address contains @
  expect(users[0].email).toContain('@');
});
