import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const resolve = file => path.resolve(__dirname, file);
const isProd = process.argv.indexOf('-p') !== -1;

const config = {
  mode: isProd ? 'production' : 'development',

  entry: resolve('src/index.js'),

  output: {
    filename: '[name].js',
    library: 'VueBucketLoader',
    libraryTarget: 'umd',

    // used to prevent window object in resulting library code
    // https://github.com/webpack/webpack/issues/6525
    globalObject: 'this',
  },

  resolve: {
    extensions: ['.vue', '.js', '.json'],
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

if (isProd) {
  config.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
      },
    }),
  )
}

export default config;
