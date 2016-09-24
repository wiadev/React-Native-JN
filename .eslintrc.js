module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    "comma-dangle": 0,
    semi: ["error", "always", { "omitLastInOneLineBlock": true}],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "consistent-return": 0,
    "no-use-before-define": 0,
    "no-case-declarations": 0,
    "no-nested-ternary": 0,
    "no-underscore-dangle": 0
  }
};
