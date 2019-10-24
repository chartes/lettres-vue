// helpers/authenticator.js

const APP_URL = 'http://localhost:9090'

class Authenticator {

    constructor(page) {
      this.properties()
      this.page = page
    }
  
    properties() {
      this.admin = {
        email: 'admin@email.fr',
        password: 'adminpassword'
      }
    }
  
    async connect(person) {
      await this.logout()
      await this.page.goto(`${APP_URL}/login`, { timeout: 0 })
      await this.page.screenshot({ path: './auth.jpg', type: 'jpeg' });
      await this.page.waitForSelector('form');
      await this.page.type('input[name="password"]', person.password)
      await this.page.type('input[name="email"]', person.email)
      await this.page.click('[name="login"]');
    }
  
    async logout() {
      await this.page.deleteCookie(...await this.page.cookies(`${APP_URL}/login`));
    }
  
  }
  
  module.exports = Authenticator