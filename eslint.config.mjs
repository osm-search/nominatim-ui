import svelte from "eslint-plugin-svelte";
import mocha from "eslint-plugin-mocha";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "airbnb-base/legacy",
    "plugin:mocha/recommended",
    "plugin:svelte/recommended",
), {
    plugins: {
        svelte,
        mocha,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
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
    },
}, {
    files: ["test/**"],

    languageOptions: {
        globals: {
            browser: true,
        },
    },
}];