const path = require("path");

const imagesIconsDir = path.resolve(__dirname, 'src/assets/images/icons/');
const quillIconsDir = path.resolve(__dirname, 'src/assets/icons/');

const appRootUrl = process.env.VUE_APP_APP_ROOT_URL || '/';

module.exports = {
  // assets are served under the app root url (/ in production, /ecco on staging)
  publicPath: appRootUrl.endsWith('/') ? appRootUrl : `${appRootUrl}/`,
  "transpileDependencies": [

  ],
  configureWebpack: {
    resolve: {
      // node core modules only required outside the browser
      // (normalize-url via mirador, wikibase-sdk)
      fallback: {
        url: false,
        querystring: false,
      },
    },
    module: {
      rules: [
        {
          // inlined as base64 data URIs, like url-loader did under webpack 4
          test: /\.(svg)(\?.*)?$/,
          include: [ imagesIconsDir ],
          type: 'asset/inline',
        },
        {
          test: /\.(svg)(\?.*)?$/,
          include: [ quillIconsDir ],
          use: [ 'svg-inline-loader' ],
        }
      ]
    }
  },
  chainWebpack: config => {
    // keep the default svg rule away from the icons handled above
    config.module
      .rule('svg')
      .exclude
        .add(imagesIconsDir)
        .add(quillIconsDir)
  }
}
