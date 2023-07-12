import * as Cypress from 'cypress';
import {
  afterScreenshotTask,
  COMPARE_TASK,
  compareTask,
  SharedValue,
} from './tasks';

export interface VisualPluginConfig extends Cypress.PluginConfigOptions {
  token: string;
  backendUrl: string;
  branch: string;
}

export function setupCypressVisualTesting(
  on: Cypress.PluginEvents,
  config: VisualPluginConfig,
) {
  const sharedValue = new SharedValue(config);
  on('task', {
    [COMPARE_TASK]: compareTask(config, sharedValue),
  });

  on('after:screenshot', afterScreenshotTask(config, sharedValue));
}
