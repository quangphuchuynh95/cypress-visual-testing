import JQueryWithSelector = Cypress.JQueryWithSelector;
import { COMPARE_TASK, CompareTaskArgs, CompareTaskReturn } from '../plugin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      checkVisual(
        screenshotName: string,
        opts?: Partial<
          Loggable & Timeoutable & ScreenshotOptions & CheckVisualOptions
        >,
      ): Chainable<void>;
    }
  }
}

export interface CheckVisualOptions {}

export const checkVisual = (
  subject: void | Document | Window | JQueryWithSelector<HTMLElement>,
  screenshotName: string,
  opts?: Partial<
    Cypress.Loggable &
      Cypress.Timeoutable &
      Cypress.ScreenshotOptions &
      CheckVisualOptions
  >,
) => {
  const screenshotNamePath = Cypress.spec.relative
    .split('/')
    .slice(2)
    .join('/');

  const fullScreenshotName = `${screenshotNamePath}/${screenshotName}`;
  const { ...screenshotOptions } = opts;
  const target = subject ? cy.wrap(subject) : cy;
  target.screenshot(fullScreenshotName, screenshotOptions);
  const args: CompareTaskArgs = {
    screenshotName: fullScreenshotName,
  };
  cy.task<CompareTaskReturn>(COMPARE_TASK, args).then(({ pass, message }) => {
    console.log(pass);
    if (!pass) {
      throw new Error(message || 'Compare image failed');
    }
  });
};

export function addCheckVisualCommand() {
  Cypress.Commands.add(
    'checkVisual',
    {
      prevSubject: ['optional', 'element', 'window', 'document'],
    },
    checkVisual,
  );
}
