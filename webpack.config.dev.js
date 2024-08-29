const webpackConfig = require('./webpack.config.js');
const Dotenv = require('dotenv-webpack');

module.exports = {
  ...webpackConfig,
  mode: 'development',
  plugins: [
    new Dotenv(),
    ...webpackConfig.plugins
  ]
}
