import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Screenshot } from '../entities/screenshot.entity';
import { ScreenshotService } from '../screenshot.service';
import { BranchScreenshotService } from '../../branch-screenshot/branch-screenshot.service';

@EventSubscriber()
export class ScreenshotSubscriber
  implements EntitySubscriberInterface<Screenshot>
{
  constructor(
    dataSource: DataSource,
    private branchScreenshotService: BranchScreenshotService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Screenshot;
  }

  async afterUpdate(event: UpdateEvent<Screenshot>) {
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
