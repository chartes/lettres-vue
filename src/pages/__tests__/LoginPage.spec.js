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
 
describe("User login", () => {
    let authenticator;

    beforeEach(async () => {
      authenticator =  new Authenticator(browser.page);
      await authenticator.logout();
    })

    test("should not have any cookies at first", async () => {
       expect.assertions(1);
       expect(browser.page.cookies()).resolves.toEqual([]);
    }, 16000);

 
    test("should not have any cookies at first", async () => {
        //expect.assertions(1);
        //expect(browser.page.cookies()).resolves.toEqual([]);
        const realUser = {
            email: 'julien.pilla@chartes.psl.eu',
            password: 'Lettres2019!'
        }
        await authenticator.connect(realUser);
        //await browser.page.screenshot({ path: './image.jpg', type: 'jpeg' });
        const cookies = await browser.page.cookies();
        console.log("cookies after login", cookies);
     }, 16000);

    // reset to the default connection
    afterEach(async () => {
      await authenticator.connect(authenticator.admin)
    })
})