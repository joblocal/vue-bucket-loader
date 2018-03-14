import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const resolve = file => path.resolve(__dirname, file);

const config = {
  mode: 'production',

  entry: resolve('src/index.js'),

  output: {
    filename: 'index.js',
    library: 'vue-bucket-loader',
    libraryTarget: 'umd',
    umdNamedDefine: true,

    // used to prevent window object in resulting library code
    // https://github.com/webpack/webpack/issues/6525
    globalObject: 'this',
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
        loader: 'vue-loader',
      },
    ],
  },

  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
      },
    }),
  ],
};

module.exports = config;
