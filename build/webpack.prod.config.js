import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import resolve from './webpack.utils';

module.exports = {
  mode: 'production',

  entry: resolve('../src/index.js'),

  output: {
    filename: 'index.js',
    library: 'vue-bucket-loader',
    libraryTarget: 'umd',
    umdNamedDefine: true,

    // used to prevent window object in resulting library code
    // https://github.com/webpack/webpack/issues/6525
    globalObject: 'this',
  },

  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
      },
    }),
  ],
};
