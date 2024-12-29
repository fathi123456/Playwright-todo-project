import { Page } from "@playwright/test";


export default class TodoPage{
private page : Page;
    //constructor
 constructor(page: Page){
    this.page=page;
 }

    get welcomeMessage(){
        return '[data-testid="welcome"]' ; 
    }

    getWelcomeMessage(){
        return this.page.locator('[data-testid="welcome"]')
    }

}