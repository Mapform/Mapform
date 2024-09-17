module.exports = {
  root: true,
  extends: ["@mapform/eslint-config/next.js"],
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
