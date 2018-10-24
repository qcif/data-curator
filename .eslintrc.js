module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['standard', 'plugin:vue/base'],
  globals: {
    __static: true
  },
  plugins: [
    'vue'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'camelcase' : 0,
    'no-undef': 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'eqeqeq': 0,
    'no-callback-literal': 0,
    'space-infix-ops': 0
  }
}
