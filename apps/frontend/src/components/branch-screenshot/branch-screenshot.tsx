import { useBranchScreenshotsQuery } from '../../graphql';
import { Box, List, LoadingOverlay } from '@mantine/core';
import { ScreenshotItem } from './components/screenshot-item';

export interface BranchScreenshotProps {
  branch: string;
}

export function BranchScreenshot({ branch }: BranchScreenshotProps) {
  const { isSuccess, data, isLoading } = useBranchScreenshotsQuery({
    branch,
  });

  const branchScreenshots = data?.branch?.branchScreenshots;

  return (
    <Box>
      <LoadingOverlay visible={isLoading} />
      {isSuccess && branchScreenshots && (
        <List listStyleType="disc">
          {branchScreenshots.map((branchScreenshot) => (
            <List.Item>
              <ScreenshotItem
                key={branchScreenshot.id}
                branch={branch}
                branchScreenshot={branchScreenshot}
              />
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
}
