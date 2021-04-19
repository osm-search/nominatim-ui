module.exports = {
  extends: [
    'airbnb-base/legacy',
    'plugin:mocha/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  env: {
    browser: true,
    jquery: true
  },
  plugins: [
    'svelte3',
    'mocha'
  ],
  overrides: [
    {
      files: ['*'],
      globals: {
        L: true, // leaflet library
        Nominatim_Config: true
      },
      rules: {
        camelcase: 'off', // my_var is fine, no need for myVar
        'func-names': 'off', // anonymous 'function()' is fine
        'vars-on-top': 'off',
        'new-cap': 'off', // constructor name can start lowercase (as Leaflet does)
        'no-multiple-empty-lines': 'off',
        'no-use-before-define': ['error', { functions: false }],
        'padded-blocks': 'off',
        'no-param-reassign': 'off',
        'max-len': [
          'error',
          100,
          2,
          {
            ignoreUrls: true,
            ignoreComments: false
          }
        ]
      }
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-label-var': 'off' // eslint thinks $: (https://svelte.dev/tutorial/reactive-statements) are labels
      }
    },
    {
      files: ['test/**'],
      globals: {
        browser: true
      }
    }
  ]
};
