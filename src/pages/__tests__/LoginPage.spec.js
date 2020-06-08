import Authenticator from '../../modules/helpers/authenticator';
import Browser from '../../modules/helpers/browser';


let browser;

beforeAll(async () => {
    browser = new Browser();
    await browser.start();
});

afterAll(async () => {
    await browser.close();
});
 
describe("User login page", () => {
    let authenticator;

    beforeEach(async () => {
      authenticator =  new Authenticator(browser.page);
      await authenticator.logout();
    })

    test("It should not have any cookies at first", async () => {
       expect.assertions(1);
       expect(browser.page.cookies()).resolves.toEqual([]);
    }, 16000);

    test("Then after login it should have access and refresh cookies", async () => {
        expect.assertions(2);
        expect(browser.page.cookies()).resolves.toEqual([]);
        /*
        const fakeUser = {
            email: 'testuser@chartes.test',
            password: `wrongPass`
        }
        */
        await authenticator.connect(authenticator.admin);
    
        const welcomeText = await browser.find('.welcome')
        console.log( welcomeText);

        const cookies = await browser.page.cookies();
        console.log("cookies after login", cookies);

        expect(cookies.length).toEqual(4);
     }, 16000);

    // reset to the default connection
    afterEach(async () => {
      await authenticator.connect(authenticator.admin)
    })
})