import { defineConfig } from 'cypress';
import { setupCypressVisualTesting } from '@cypress-visual-testing/cypress-plugin';

export default defineConfig({
  e2e: {
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
