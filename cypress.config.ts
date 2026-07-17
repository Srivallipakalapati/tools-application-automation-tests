
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    "watchForFileChanges": false,
    baseUrl: 'https://practicesoftwaretesting.com/',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config); on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      return config;
    },
  },
});
