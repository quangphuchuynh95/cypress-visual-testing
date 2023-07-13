import { defineConfig } from 'cypress';
import { setupCypressVisualTesting } from '@cypress-visual-testing/cypress-plugin';

export default defineConfig({
  downloadsFolder: 'downloads',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  fixturesFolder: 'src/fixtures',
  e2e: {
    supportFile: 'src/support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      setupCypressVisualTesting(on, {
        branch: 'hEllo',
        ...config,
        token: 'test-token',
        backendUrl: 'http://localhost:3000',
      });
    },
  },
});
