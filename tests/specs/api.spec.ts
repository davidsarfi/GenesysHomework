import { test, expect } from '@playwright/test';

test('REST API - get users and validate response', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users');

  expect(response.ok()).toBeTruthy();
  const users = await response.json();

  for (const user of users) {
    console.log(`${user.name} | ${user.email}`);
  }
  expect(users[0].email).toContain('@');
  
});
