module.exports = {
  overrides: [
    {
      env: {
        node: true,
      },
      files: ["*.js", "*.ts"],
      excludedFiles: ".eslintrc.js",
      extends: ["standard-with-typescript", "plugin:prettier/recommended"],
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/ban-types": [
          "error",
          {
            "types": {
              "{}": false
            },
            "extendDefaults": true
          }
        ]
      },
    },
  ],
};
