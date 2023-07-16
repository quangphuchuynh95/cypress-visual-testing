import { Box, Select, Stack } from '@mantine/core';
import { useAllBranchesQuery } from '../graphql';
import { BranchScreenshot } from '../components/branch-screenshot';
import { useSearchParams } from 'react-router-dom';

export default function BranchScreenshotsPage() {
  const branchesQuery = useAllBranchesQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const onChangeBranchName = (value: string | null) => {
    setSearchParams((old) => {
      const cloned = new URLSearchParams(old.toString());
      cloned.set('branch', value ?? '');
      return cloned;
    });
  };
  const onChangeScreenshotName = (value: string | null) => {
    setSearchParams((old) => {
      const cloned = new URLSearchParams(old.toString());
      cloned.set('screenshot', value ?? '');
      return cloned;
    });
  };
  const branchName = searchParams.get('branch');
  const screenshotName = searchParams.get('screenshot');
  return (
    <Box>
      <Stack spacing="xs">
        <Box>
          <Select
            value={branchName}
            onChange={onChangeBranchName}
            placeholder="Select a branch"
            data={(branchesQuery?.data?.branches || []).map(
              (branch) => branch.name,
            )}
          />
        </Box>
        <Box>
          {branchName && (
            <BranchScreenshot
              screenshot={screenshotName}
              branch={branchName}
              onClosePopup={() => onChangeScreenshotName(null)}
              onChangePopup={onChangeScreenshotName}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
