import {
  Button,
  Group,
  Image,
  LoadingOverlay,
  MantineColor,
  Modal,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine/core';
import {
  BranchScreenshotsQuery,
  useApproveBranchScreenshotMutation,
  useBranchScreenshotsQuery,
} from '../../../../graphql';
import { createUrl } from '../../../../helpers/s3.ts';
import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ZoomArea, ZoomValue } from '../../../zoom-area';
import { isScreenshotApprovalNecessary } from '../../../../graphql/helpers.ts';

export interface ScreenshotItemProps {
  active: boolean;
  branch: string;
  branchScreenshot: BranchScreenshotsQuery['branch']['branchScreenshots'][number];
  onClose: () => void;
  onClick: (e: React.MouseEvent, screenshot: string) => void;
  // hasNext: boolean;
  // onClickNext: boolean;
}

export function ScreenshotItem({
  active,
  branchScreenshot,
  branch,
  onClick,
  onClose,
}: ScreenshotItemProps) {
  const [message, setMessage] = useState('');
  const [zoomValue, setZoomValue] = useState<ZoomValue>({
    zoom: 1,
    translateX: 0,
    translateY: 0,
  });
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApproveBranchScreenshotMutation({
    onSuccess() {
      setMessage('');
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
      message,
      screenshot: branchScreenshot.screenshot.name,
      branch: branch,
    });
  }, [branch, branchScreenshot.screenshot.name, message, mutate]);

  const isApprovalNecessary = isScreenshotApprovalNecessary(branchScreenshot);

  return (
    <>
      <Modal
        size="auto"
        w={1000}
        opened={active}
        onClose={onClose}
        title={branchScreenshot.screenshot.name}
      >
        <LoadingOverlay visible={isLoading} />
        {branchScreenshot.diffMessage && (
          <Text color="red.9">{branchScreenshot.diffMessage}</Text>
        )}
        <Group noWrap align="start">
          {isApprovalNecessary && !!branchScreenshot.screenshot.fileKey && (
            <ZoomArea h={500} value={zoomValue} onChange={setZoomValue}>
              <Image
                w="100%"
                src={createUrl(branchScreenshot.screenshot.fileKey).toString()}
              />
            </ZoomArea>
          )}
          {isApprovalNecessary && !!branchScreenshot.diffFileKey && (
            <ZoomArea h={500} value={zoomValue} onChange={setZoomValue}>
              <Image
                w="100%"
                src={createUrl(branchScreenshot.diffFileKey).toString()}
              />
            </ZoomArea>
          )}
          <ZoomArea h={500} value={zoomValue} onChange={setZoomValue}>
            <Image
              w="100%"
              src={createUrl(branchScreenshot.fileKey).toString()}
            />
          </ZoomArea>
        </Group>

        <Group mt="xl">
          {isApprovalNecessary && (
            <Stack>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="outline" onClick={onApprove}>
                Approve
              </Button>
            </Stack>
          )}
        </Group>
      </Modal>
      <UnstyledButton
        onClick={(e) => onClick(e, branchScreenshot.screenshot.name)}
      >
        <Text color={color}>{branchScreenshot.screenshot.name}</Text>
      </UnstyledButton>
    </>
  );
}
