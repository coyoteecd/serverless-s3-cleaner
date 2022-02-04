module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Typescript's unused variable checking is already enabled in tsconfig
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',

    // Controlled via .gitattributes
    'linebreak-style': 'off',

    // too strict
    'lines-between-class-members': 'off',
    'comma-dangle': 'off',
    'padded-blocks': 'off',
    'max-len': ['error', {
      code: 160,
      ignoreUrls: true
    }],
    'no-constant-condition': 'off',
    'no-await-in-loop': 'off',
    'arrow-parens': 'off',
    'function-paren-newline': ['error', 'consistent'],
    'no-useless-constructor': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',

    // meh
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
    'no-use-before-define': 'off',

    // serverless chokes otherwise
    'import/no-import-module-exports': 'off',

    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true
    }]
  }
};
