import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { BranchScreenshotService } from '../../branch-screenshot/branch-screenshot.service';
import { ScreenshotVersionService } from '../screenshot-version.service';
import { InsertEvent } from 'typeorm/subscriber/event/InsertEvent';

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

  async afterInsert(event: InsertEvent<Screenshot>) {
    await this.screenshotVersionService.createVersion(event.entity);
  }

  async afterUpdate(event: UpdateEvent<Screenshot>) {
    const newFileKey = event.entity?.fileKey;
    if (newFileKey !== event.databaseEntity.fileKey) {
      await this.screenshotVersionService.createVersion(
        event.entity as Screenshot,
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
