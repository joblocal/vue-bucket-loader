// https://eslint.org/docs/user-guide/configuring

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",

  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },

  "plugins": [
    "import",
  ],
}

