// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Underscore-prefixed args are intentionally unused (Phase 4 seams that
      // must keep their signature today).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // ---------------------------------------------------------------------------
  // ARCHITECTURAL BOUNDARY (enforced, not documented)
  //
  // src/app/three/ is the framework-agnostic 3D engine. It must never import
  // Angular: a 60fps render loop that can reach change detection is a
  // performance bug waiting to happen, and the engine has to stay testable
  // without a TestBed. The only permitted seam is src/app/bridge/.
  // ---------------------------------------------------------------------------
  {
    files: ["src/app/three/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@angular/*", "**/app/core/**", "**/app/features/**", "**/app/shared/**"],
              message:
                "src/app/three must contain zero Angular imports. Communicate through src/app/core/three/three-engine.service.ts instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    // The command palette implements the WAI-ARIA combobox + listbox pattern
    // with `aria-activedescendant`: options are deliberately NOT focusable, and
    // keyboard activation happens on the input that owns them. These two rules
    // cannot see that relationship and would push the markup toward a pattern
    // that is actually less accessible for a type-ahead list.
    files: ["src/app/shared/command-palette/command-palette.html"],
    rules: {
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
    },
  }
);
