import svelte from "eslint-plugin-svelte";
import mocha from "eslint-plugin-mocha";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    // "airbnb-base/legacy", // https://github.com/airbnb/javascript/issues/2961 
    mocha.configs.flat.recommended,
    ...svelte.configs.recommended,
{
    plugins: {
        svelte,
        mocha,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node
        },

        ecmaVersion: 2019,
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

        "svelte/require-each-key": "off",
        "svelte/no-immutable-reactive-statements": "off"
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