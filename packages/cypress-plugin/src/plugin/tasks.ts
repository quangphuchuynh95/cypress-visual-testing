import Cypress from 'cypress';
import { VisualPluginConfig } from './plugin';
import { VisualClient } from '../visual-client/visual-client';

export const COMPARE_TASK = '@cypress-visual-testing/compare';

export type CompareTaskReturn = {
  pass: boolean;
  message?: string;
};

export type CompareTaskArgs = {
  screenshotName: string;
};

export function compareTask(
  config: VisualPluginConfig,
  sharedValue: SharedValue,
) {
  return async function ({
    screenshotName,
  }: CompareTaskArgs): Promise<CompareTaskReturn> {
    const screenshot = sharedValue.screenshot.get(screenshotName);
    if (!screenshot || !screenshot.currentVersionPath) {
      return {
        pass: false,
        message: 'We have a problem when getting the screenshot',
      };
    }
    const data = await sharedValue.client.uploadScreenshot({
      screenshotName: screenshotName,
      imageFilePath: screenshot.currentVersionPath,
    });

    return {
      pass: data.diffStatus === 'ExactlyTheSame',
      message: data.diffMessage,
    };
  };
}

export function afterScreenshotTask(
  config: VisualPluginConfig,
  sharedValue: SharedValue,
) {
  return function ({
    name,
    path,
  }: Cypress.ScreenshotDetails):
    | void
    | Cypress.AfterScreenshotReturnObject
    | Promise<Cypress.AfterScreenshotReturnObject> {
    const screenshot = new Screenshot(path);
    sharedValue.screenshot.set(name, screenshot);
  };
}

export class Screenshot {
  constructor(private _currentVersionPath: string) {}

  public setCurrentVersionPath(path: string) {
    this._currentVersionPath = path;
  }

  get currentVersionPath(): string {
    return this._currentVersionPath;
  }
}

export class SharedValue {
  public screenshot: Map<string, Screenshot>;
  public client: VisualClient;
  constructor(config: VisualPluginConfig) {
    this.client = new VisualClient(config);
    this.screenshot = new Map();
  }
}
