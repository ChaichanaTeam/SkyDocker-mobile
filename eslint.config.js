// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "CHECK_IN_CONFIG",
          property: "PILOT",
          message: "Use PILOTS_CONFIG for pilot endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "DRONES",
          message: "Use PILOTS_CONFIG for pilot endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "MISSIONS",
          message: "Use PILOTS_CONFIG for pilot endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "PRIVILEGES",
          message: "Use PILOTS_CONFIG for pilot endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "ACTIVE",
          message: "Use PILOTS_CONFIG for pilot endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "COUNTRY",
          message: "Use GEO_ZONE_CONFIG for geo-zone endpoints.",
        },
        {
          object: "CHECK_IN_CONFIG",
          property: "SUPPORTED_COUNTRIES",
          message: "Use GEO_ZONE_CONFIG for geo-zone endpoints.",
        },
      ],
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
]);
