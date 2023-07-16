import { useBranchScreenshotsQuery } from '../../graphql';
import { Box, List, LoadingOverlay } from '@mantine/core';
import { ScreenshotItem } from './components/screenshot-item';

export interface BranchScreenshotProps {
  branch: string;
  screenshot: string | null;
  onClosePopup: () => void;
  onChangePopup: (screenshot: string) => void;
}

export function BranchScreenshot({
  branch,
  screenshot,
  onChangePopup,
  onClosePopup,
}: BranchScreenshotProps) {
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
            <List.Item key={branchScreenshot.id}>
              <ScreenshotItem
                active={
                  !!screenshot &&
                  screenshot === branchScreenshot.screenshot.name
                }
                branch={branch}
                branchScreenshot={branchScreenshot}
                onClose={onClosePopup}
                onClick={(_, screenshot) => onChangePopup(screenshot)}
              />
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
}
