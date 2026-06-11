/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],

    rules: {
        'order/properties-alphabetical-order': null,

        'scss/dollar-variable-pattern': null,
        'selector-class-pattern': null,
        'max-nesting-depth': 5,
        'selector-max-id': 0,
    },

    ignoreFiles: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.min.css',
    ],
}
