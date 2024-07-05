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

export default [...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 13,
        sourceType: "module",
    },

    rules: {
        eqeqeq: "error",
        indent: ["warn", 4],

        "brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],

        curly: ["error", "multi-line"],
        "keyword-spacing": "error",
        "spaced-comment": "error",

        quotes: ["error", "single", {
            avoidEscape: true,
        }],

        "no-trailing-spaces": "error",

        "max-len": ["warn", {
            code: 160,
        }],

        semi: "error",
        "eol-last": "error",
        "quote-props": ["error", "consistent-as-needed"],
        "no-unused-expressions": "error",
    },
}, {
    files: ["**/*.test.js", "**/*.spec.js"],

    rules: {
        "no-unused-expressions": "off",
    },
}];