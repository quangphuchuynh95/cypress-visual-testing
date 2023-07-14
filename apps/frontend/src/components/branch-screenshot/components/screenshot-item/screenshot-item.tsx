import {
  Button,
  Group,
  Image,
  LoadingOverlay,
  MantineColor,
  Modal,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  BranchScreenshotsQuery,
  useApproveBranchScreenshotMutation,
  useBranchScreenshotsQuery,
} from '../../../../graphql';
import { useDisclosure } from '@mantine/hooks';
import { createUrl } from '../../../../helpers/s3.ts';
import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ZoomArea, ZoomValue } from '../../../zoom-area';

export interface ScreenshotItemProps {
  branch: string;
  branchScreenshot: BranchScreenshotsQuery['branch']['branchScreenshots'][number];
}

export function ScreenshotItem({
  branchScreenshot,
  branch,
}: ScreenshotItemProps) {
  const [zoomValue, setZoomValue] = useState<ZoomValue>({
    zoom: 1,
    translateX: 0,
    translateY: 0,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApproveBranchScreenshotMutation({
    onSuccess() {
      queryClient.refetchQueries(
        useBranchScreenshotsQuery.getKey({
          branch,
        }),
      );
    },
  });

  const color = useMemo((): MantineColor => {
    return branchScreenshot.diffMessage ? 'red.9' : 'green.9';
  }, [branchScreenshot.diffMessage]);

  const onApprove = useCallback(() => {
    mutate({
      screenshot: branchScreenshot.screenshot.name,
      branch: branch,
    });
  }, [branch, branchScreenshot.screenshot.name, mutate]);

  return (
    <>
      <Modal
        size="auto"
        w={1000}
        opened={opened}
        onClose={close}
        title={branchScreenshot.screenshot.name}
      >
        <LoadingOverlay visible={isLoading} />
        {branchScreenshot.diffMessage && (
          <Text color="red.9">{branchScreenshot.diffMessage}</Text>
        )}
        <Group noWrap align="start">
          {branchScreenshot.diffMessage &&
            branchScreenshot.screenshot.fileKey && (
              <ZoomArea h={300} value={zoomValue} onChange={setZoomValue}>
                <Image
                  w="100%"
                  src={createUrl(
                    branchScreenshot.screenshot.fileKey,
                  ).toString()}
                />
              </ZoomArea>
            )}
          {branchScreenshot.diffMessage && branchScreenshot.diffFileKey && (
            <ZoomArea h={300} value={zoomValue} onChange={setZoomValue}>
              <Image
                w="100%"
                src={createUrl(branchScreenshot.diffFileKey).toString()}
              />
            </ZoomArea>
          )}
          <ZoomArea h={300} value={zoomValue} onChange={setZoomValue}>
            <Image
              w="100%"
              src={createUrl(branchScreenshot.fileKey).toString()}
            />
          </ZoomArea>
        </Group>

        <Group mt="xl">
          <Button variant="outline" onClick={onApprove}>
            Approve
          </Button>
        </Group>
      </Modal>
      <UnstyledButton onClick={open}>
        <Text color={color}>{branchScreenshot.screenshot.name}</Text>
      </UnstyledButton>
    </>
  );
}
