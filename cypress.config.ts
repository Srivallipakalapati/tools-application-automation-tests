
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
const mochawesomeReporter = require("cypress-mochawesome-reporter/plugin");

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportFilename: "test-report",
    reportPageTitle: "Toolshop Automation Test Report",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true,
    html: false,
    json: true,
    code: false
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: 'https://practicesoftwaretesting.com/',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      mochawesomeReporter(on);
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      return config;
    },
  },
});
