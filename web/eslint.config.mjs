import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import next from "eslint-plugin-next";
import { group } from "console";

export default [
  js.configs.recommended,
  next.configs["core-web-vitals"], // Keep Next.js best practices

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      react,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    ignores: [".*.js", "node_modules/", "dist/"],

    rules: {
      "no-useless-escape": "off",
      "prefer-const": "error",
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "error",
      "no-duplicate-imports": "error",
      "no-useless-catch": "warn",
      "no-case-declarations": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "arrow-body-style": ["error", "as-needed"],
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "react/jsx-key": "error",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-boolean-value": "error",
      "react/jsx-no-duplicate-props": "error",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-ts-expect-error": "warn",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "internal", "react"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
