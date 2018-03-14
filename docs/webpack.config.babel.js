import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const resolve = file => path.resolve(__dirname, file);

const config = {
  mode: 'development',

  entry: resolve('src/index.js'),

  devServer: {
    contentBase: resolve('./'),
    port: 9000,
  },

  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      src: resolve('src'),
      components: resolve('src/components'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        use: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
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

