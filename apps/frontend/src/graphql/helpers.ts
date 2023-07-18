import { BranchScreenshotsQuery, DiffStatus } from './index.ts';

export const isScreenshotApprovalNecessary = (
  branch: Pick<
    BranchScreenshotsQuery['branch']['branchScreenshots'][number],
    'diffStatus'
  >,
) => branch.diffStatus !== DiffStatus.ExactlyTheSame;
