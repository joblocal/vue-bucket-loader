import HtmlWebpackPlugin from 'html-webpack-plugin';
import resolve from './webpack.utils';

module.exports = {
  mode: 'development',

  entry: resolve('../docs/src/index.js'),

  devServer: {
    contentBase: resolve('../docs'),
    port: 9000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('../docs/index.html'),
      inject: true,
    }),
  ],
};
