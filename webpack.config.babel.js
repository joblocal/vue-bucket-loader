import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const resolve = file => path.resolve(__dirname, file);
const isProd = process.argv.indexOf('-p') !== -1;

const config = {
  mode: isProd ? 'production' : 'development',

  entry: isProd ? resolve('src/index.js') : resolve('docs/src/index.js'),

  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'VueBucketLoader',

    // used to prevent window object in resulting library code
    // https://github.com/webpack/webpack/issues/6525
    globalObject: 'this',
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
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('docs/index.html'),
      inject: true,
    }),
    new ExtractTextPlugin('style.css'),
  ],

  devServer: {
    contentBase: resolve('docs'),
  },
};

export default config;
