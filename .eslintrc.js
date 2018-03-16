module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },

  extends: 'airbnb-base',

  env: {
    browser: true,
    jest: true,
    es6: true,
  },

  // required to lint *.vue files
  plugins: [
    'import',
    'html',
  ],

  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.babel.js',
      },
    },
  },

  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
    }],

    // don't require devDependencies in build folder
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        'build/*.js',
        '**/*.test.js',
        '**/*.spec.js',
        'webpack.config.babel.js',
      ],
    }],

    // allow debugger/console during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
