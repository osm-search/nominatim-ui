import svelte from "eslint-plugin-svelte";
import mocha from "eslint-plugin-mocha";
import prettier from "eslint-plugin-prettier/recommended";
import security from 'eslint-plugin-security';
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    mocha.configs.recommended,
    ...svelte.configs.recommended,
{
    plugins: {
        svelte,
        mocha,
        prettier,
        security,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node
        },

        ecmaVersion: 2024,
        sourceType: "module",
    },
}, {
    files: ["**/*"],

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
    files: ["test/**"],

    languageOptions: {
        globals: {
            browser: true,
        },
    },
}, {
    files: ["src/color-mode-toggler.js"],
    rules: {
        "semi": "off",
        "max-len": "off"
    }
}];