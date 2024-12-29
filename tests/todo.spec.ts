import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';
import User from '../models/User';
import UserApi from '../apis/UserApi';
import TodoApi from '../apis/TodoApi';

test('should be able to create a todo', async ({ browser }) => {
    const apiContext = await request.newContext();
     //Create User

    const user = new User(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        'Ilef123456@'
    );

   
    //Register using the API

    const userApi = new UserApi(apiContext);
    const response = await userApi.register(user);

    //set Cookies

    const responseBody = await response.json();
    const accessToken = responseBody.access_token;
    const userID = responseBody.userID;
    const firstName = responseBody.firstName;
    user.setAccessToken(accessToken);

    const context = await browser.newContext();
    await context.addCookies([
        {
            name: 'access_token',
            value: accessToken,
            domain: 'todo.qacart.com',
            path: '/',
        },
        {
            name: 'firstName',
            value: firstName,
            domain: 'todo.qacart.com',
            path: '/',
        },
        {
            name: 'userID',
            value: userID,
            domain: 'todo.qacart.com',
            path: '/',
        },
    ]);
    //UI steps
    

    const todoPage = await context.newPage();
    const todoApi = new TodoApi(apiContext);
    await todoApi.addTodo(user);

    await todoPage.goto('https://todo.qacart.com/todo');

    const todoMessage = await todoPage
        .locator('[data-testid="todo-text"]')
        .nth(0)
        .innerText();
    expect(todoMessage.trim()).toEqual('Playwright');
});

test('should be able to delete a todo', async ({ page }) => {
    const user = new User(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        'Ilef123456@'
    );

    await page.goto('https://todo.qacart.com/signup');

    await page.type('[data-testid="first-name"]', user.getFirstName());
    await page.type('[data-testid="last-name"]', user.getLastName());
    await page.type('[data-testid="email"]', user.getEmail());
    await page.type('[data-testid="password"]', user.getPassword());
    await page.type('[data-testid="confirm-password"]', user.getPassword());

    await page.getByRole('button', { name: 'Signup' }).click();

    await page.click('[data-testid="add"]');
    await page.type('[data-testid="new-todo"]', 'Playwright');
    await page.click('[data-testid="submit-newTask"]');

    await page.click('[data-testid="delete"]');

    const noTodoMessage = page.locator('[data-testid="no-todos"]');
    await expect(noTodoMessage).toBeVisible();
});
