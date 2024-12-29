import { BrowserContext, Page } from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import config from  '../playwright.config'


export default class RegisterPage{
    private request :APIRequestContext ;
    private context : BrowserContext ; 

    private page : Page;
    //constructor
 constructor(page:Page , request:APIRequestContext , context:BrowserContext){
    this.page=page;
    this.request=request;
    this.context = context ;
 }


    //Elements
    private get firstNameImpot(){
        return '[data-testid="first-name"]';
    }
    private get lastNameImpot(){
        return '[data-testid="last-name"]';
    }
    private get emailImpot(){
        return '[data-testid="email"]';
    }
    private get passwordImpot(){
        return '[data-testid="password"]';
    }
    private get confirmPasswordImpot(){
        return '[data-testid="confirm-password"]';
    }
    private get submitButton(){
        return '[data-testid="submit"]';
    }


    //Methods or steps
    async load(){
        await this.page.goto('/signup');
    }
    async register(user: User){
        await this.page.type(this.firstNameImpot,user.getFirstName());
        await this.page.type(this.lastNameImpot,user.getLastName());
        await this.page.type(this.emailImpot,user.getEmail());
        await this.page.type(this.passwordImpot,user.getPassword())
        await this.page.type(this.confirmPasswordImpot,user.getPassword())
        await this.page.click(this.submitButton);
    }

    async registerUsingTheApi(user : User){
      
    const response = await new UserApi(this.request).register(user);

    //set Cookies

    const responseBody = await response.json();
    const accessToken = responseBody.access_token;
    const userID = responseBody.userID;
    const firstName = responseBody.firstName;
    user.setAccessToken(accessToken);

    const context = await browser.newContext();
    await this.context.addCookies([
        {
            name: 'access_token',
            value: accessToken,
        
            url: config.use?.baseURL,
        },
        {
            name: 'firstName',
            value: firstName,
        
            url: config.use?.baseURL,
        },
        {
            name: 'userID',
            value: userID,
            
            url: config.use?.baseURL,
        },
    ]);
    }

}