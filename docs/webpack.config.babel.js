import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const resolve = file => path.resolve(__dirname, file);

const config = {
  mode: 'development',
  entry: resolve('src/index.js'),

  devServer: {
    contentBase: resolve('./'),
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      inject: true,
    }),
  ],
};

module.exports = config;

