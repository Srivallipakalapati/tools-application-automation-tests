
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
const mochawesomeReporter = require("cypress-mochawesome-reporter/plugin");
const fs = require("fs");
const path = require("path");

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportFilename: "test-report",
    reportPageTitle: "Toolshop Automation Test Report",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: false,
    html: false,
    json: true,
    code: false
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    async setupNodeEvents(on, config) {
      const envFile = (config.env.envFile as string) || "main";
      const envConfig = JSON.parse(
        fs.readFileSync(path.resolve("config", `${envFile}.json`), "utf-8")
      );
      config.baseUrl = envConfig.baseUrl;
      config.expose = { apiUrl: envConfig.apiUrl };

      await addCucumberPreprocessorPlugin(on, config);
      mochawesomeReporter(on);
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      return config;
    },
  },
});
