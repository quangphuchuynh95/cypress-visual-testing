import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { BranchScreenshot } from '../entities/branch-screenshot.entity';
import { ScreenshotService } from '../../screenshot/screenshot.service';
import { BranchService } from '../../branch/branch.service';

@EventSubscriber()
export class BranchScreenshotSubscriber
  implements EntitySubscriberInterface<BranchScreenshot>
{
  constructor(
    dataSource: DataSource,
    private screenshotService: ScreenshotService,
    private branchService: BranchService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return BranchScreenshot;
  }
}
