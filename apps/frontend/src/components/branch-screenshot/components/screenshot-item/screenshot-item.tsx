import {
  Anchor,
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
import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface ScreenshotItemProps {
  branch: string;
  branchScreenshot: BranchScreenshotsQuery['branch']['branchScreenshots'][number];
}

export function ScreenshotItem({
  branchScreenshot,
  branch,
}: ScreenshotItemProps) {
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
              <Anchor
                target="_blank"
                href={createUrl(branchScreenshot.screenshot.fileKey).toString()}
              >
                <Image
                  w={500}
                  src={createUrl(
                    branchScreenshot.screenshot.fileKey,
                  ).toString()}
                />
              </Anchor>
            )}
          {branchScreenshot.diffMessage && branchScreenshot.diffFileKey && (
            <Anchor
              target="_blank"
              href={createUrl(branchScreenshot.diffFileKey).toString()}
            >
              <Image
                w={500}
                src={createUrl(branchScreenshot.diffFileKey).toString()}
              />
            </Anchor>
          )}
          <Anchor
            target="_blank"
            href={createUrl(branchScreenshot.fileKey).toString()}
          >
            <Image
              w={500}
              src={createUrl(branchScreenshot.fileKey).toString()}
            />
          </Anchor>
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
