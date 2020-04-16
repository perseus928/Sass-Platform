const config = require('eslint-config-react-app');

function updateWarnRulesToErrorRules(rules) {
  const newRules = {};

  Object.keys(rules).forEach((key) => {
    const value = rules[key];
    if (Array.isArray(value)) {
      newRules[key] = value.map((part) => (part === 'warn' ? 'error' : part));
    } else if (value === 'warn') {
      newRules[key] = 'error';
    } else {
      newRules[key] = value;
    }
  });

  return newRules;
}

function convertOverridesToArray(overrides) {
  if (!Array.isArray(overrides)) {
    return [overrides];
  }
  return overrides;
}

// Extend the create-react-app config and set all warnings to errors. Also add
// config extensions for Prettier integration, and our own rules (based on
// tslint-react).
const newConfig = Object.assign({}, config, {
  extends: ['plugin:prettier/recommended'],
  rules: Object.assign(updateWarnRulesToErrorRules(config.rules), {
    'react/jsx-boolean-value': ['error', 'always'],
    'react/jsx-key': 'error',
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
    'react/self-closing-comp': 'error',
    'react/no-string-refs': 'error',
    'constructor-super': 'error',
    curly: 'error',
    'dot-notation': 'error',
    'guard-for-in': 'error',
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-empty-function': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': 'error',
    radix: 'error',
    'use-isnan': 'error',
    'no-shadow': 'error',
    'no-unused-expressions': 'error',
    // Override create-react-app to ignore ARIA role attributes on non-DOM
    // nodes like the Author component. See
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/pull/171
    'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
  }),
  overrides: convertOverridesToArray(config.overrides).map((override) => {
    if (override.parser === '@typescript-eslint/parser') {
      // Add our custom TypeScript rules here. These are based on
      // tslint/recommended.
      return Object.assign({}, override, {
        rules: Object.assign(updateWarnRulesToErrorRules(override.rules), {
          '@typescript-eslint/adjacent-overload-signatures': 'error',
          '@typescript-eslint/array-type': [
            'error',
            { default: 'array-simple' },
          ],
          '@typescript-eslint/ban-types': 'error',
          '@typescript-eslint/class-name-casing': 'error',
          '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
              overrides: {
                constructors: 'no-public',
              },
            },
          ],
          '@typescript-eslint/consistent-type-assertions': [
            'error',
            { assertionStyle: 'as' },
          ],
          '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface',
          ],
          '@typescript-eslint/no-empty-interface': 'error',
          '@typescript-eslint/no-misused-new': 'error',
          '@typescript-eslint/no-namespace': 'error',
          '@typescript-eslint/triple-slash-reference': [
            'error',
            { types: 'prefer-import' },
          ],
          '@typescript-eslint/no-var-requires': 'error',
          '@typescript-eslint/prefer-function-type': 'error',
          '@typescript-eslint/prefer-namespace-keyword': 'error',
          '@typescript-eslint/unified-signatures': 'error',
        }),
      });
    }
    return Object.assign({}, override, {
      rules: updateWarnRulesToErrorRules(override.rules),
    });
  }),
});

// Define Cypress globals for files in Cypress directory.
newConfig.overrides.push({
  files: ['cypress/**/*.js?(x)'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mocha: true,
    node: true,
  },
  globals: {
    cy: 'readonly',
    Cypress: 'readonly',
  },
});

module.exports = newConfig;
