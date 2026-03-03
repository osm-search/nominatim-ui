import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import security from 'eslint-plugin-security';
import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    security.configs.recommended,
{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node
        },

        ecmaVersion: 2024,
        sourceType: "module",
    },
}, {
    files: ["src/**", "test/**", "*.js"],

    languageOptions: {
        globals: {
            L: true,
            Nominatim_Config: true,
        },
    },

    rules: {
        camelcase: "off",
        "func-names": "off",
        "vars-on-top": "off",
        "new-cap": "off",
        "no-multiple-empty-lines": "off",

        "no-use-before-define": ["error", {
            functions: false,
        }],

        "padded-blocks": "off",
        "no-param-reassign": "off",

        "max-len": ["error", 100, 2, {
            ignoreUrls: true,
        }],

        "no-var": "error",
        "prefer-const": "error",
        "svelte/require-each-key": "off"
    },
}, {
    files: ["src/color-mode-toggler.js"],
    rules: {
        "semi": "off",
        "max-len": "off"
    }
}];