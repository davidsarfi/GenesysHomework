import { test, expect } from '@playwright/test';

test('REST API - get users and validate response', async ({ request }) => {
  const users = await test.step('Fetch users from API', async () => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users');
    expect(response.ok()).toBeTruthy();
    return await response.json();
  });

  await test.step('Log user names and emails', async () => {
    for (const user of users) {
      console.log(`${user.name} | ${user.email}`);
    }
  });

  await test.step('Verify first user email contains @', async () => {
    expect(users[0].email).toContain('@');
  });
});
