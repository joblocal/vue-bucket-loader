import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const resolve = file => path.resolve(__dirname, file);
const isProd = process.argv.indexOf('-p') !== -1;

const config = {
  mode: isProd ? 'production' : 'development',

  entry: isProd ? resolve('src/index.js') : resolve('docs/src/index.js'),

  output: {
    filename: '[name].js',
    library: 'VueBucketLoader',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      src: resolve('src'),
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
        loader: 'vue-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('docs/index.html'),
      inject: true,
    }),
  ],

  devServer: {
    contentBase: resolve('docs'),
  },
};

export default config;
