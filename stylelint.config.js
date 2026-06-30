/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss'],

    rules: {
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
