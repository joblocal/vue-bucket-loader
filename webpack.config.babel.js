import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const config = {
  mode: 'production',
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    library: 'vue-bucket-loader',
    libraryTarget: 'umd',
    umdNamedDefine: true,

    // used to prevent window object in resulting library code
    // https://github.com/webpack/webpack/issues/6525
    globalObject: 'this',
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
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
      },
    }),
  ],
};

module.exports = config;

