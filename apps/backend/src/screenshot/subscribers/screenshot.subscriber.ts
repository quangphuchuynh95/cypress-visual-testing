import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { BranchScreenshotService } from '../../branch-screenshot/branch-screenshot.service';
import { ScreenshotVersionService } from '../screenshot-version.service';

@EventSubscriber()
export class ScreenshotSubscriber
  implements EntitySubscriberInterface<Screenshot>
{
  constructor(
    dataSource: DataSource,
    private branchScreenshotService: BranchScreenshotService,
    private screenshotVersionService: ScreenshotVersionService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Screenshot;
  }

  async afterUpdate(event: UpdateEvent<Screenshot>) {
    const newFileKey = event.entity?.fileKey;
    const message = event?.queryRunner?.data?.message ?? '';
    if (newFileKey !== event.databaseEntity.fileKey) {
      await this.screenshotVersionService.createVersion(
        event.entity as Screenshot,
        message,
      );

      // Update branch screenshots
      const branchScreenshots =
        await this.branchScreenshotService.findAllFromScreenshot(
          event.databaseEntity,
        );
      await Promise.all(
        branchScreenshots.map((item) =>
          this.branchScreenshotService.updateScreenshotDiffData(item),
        ),
      );
    }
  }
}
