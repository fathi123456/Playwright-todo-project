import {test , expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import User from '../models/User';
import RegisterPage from '../pages/RegisterPage';
import TodoPage from '../pages/TodoPage';

test("should be able to register", async({page}) =>{
    const user = new User(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        "Ilef123456@"

    )
    const registerPage = new RegisterPage(page)
    await registerPage.load()
    await registerPage.register(user);
    
    const todoPage = new TodoPage(page)
    const welcomeMessage = todoPage.getWelcomeMessage();
    await expect(welcomeMessage).toBeVisible();


})