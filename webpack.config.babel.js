import merge from 'webpack-merge';
import resolve from './build/webpack.utils';

import prodConfig from './build/webpack.prod.config';
import docsConfig from './build/webpack.docs.config';

const isProd = process.argv.indexOf('-p') !== -1;

const base = {
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      src: resolve('../src'),
      components: resolve('../src/components'),
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
};

module.exports = merge(base, isProd ? prodConfig : docsConfig);
