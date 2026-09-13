const path = require("path");

const imagesIconsDir = path.resolve(__dirname, 'src/assets/images/icons/');
const quillIconsDir = path.resolve(__dirname, 'src/assets/icons/');

module.exports = {
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
