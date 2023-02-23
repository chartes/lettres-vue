const path = require("path");

module.exports = {
  "transpileDependencies": [
  
  ], configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(svg)(\?.*)?$/,
          include: [
              path.resolve(__dirname, 'src/assets/images/icons/'),
              path.resolve(__dirname, 'src/assets/images/icons/'),
          ],
          use: ['url-loader'],
        },
        {
          test: /\.(svg)(\?.*)?$/,
          include: [ path.resolve(__dirname, 'src/assets/icons/')  ],
          use:
          [
            {
              loader: 'svg-inline-loader',
              options: {
                limit: 10000,
                name: 'assets/img/[name].[hash:7].[ext]'
              }
            }
          ]
        }
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .test(() => false)
      .use('file-loader')
  }
}
