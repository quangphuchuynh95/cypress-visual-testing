import {
  Resolver,
  ResolveField,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { BranchScreenshot } from './entities/branch-screenshot.entity';
import { Screenshot } from '../screenshot/entities/screenshot.entity';
import { BranchScreenshotService } from './branch-screenshot.service';

@Resolver(() => BranchScreenshot)
export class BranchScreenshotResolver {
  constructor(
    private readonly branchScreenshotService: BranchScreenshotService,
  ) {}

  @ResolveField(() => Screenshot)
  screenshot(@Parent() branchScreenshot: BranchScreenshot) {
    return this.branchScreenshotService.findScreenshot(branchScreenshot);
  }

  @Mutation(() => BranchScreenshot, { nullable: true })
  approveBranchScreenshot(
    @Args('branchName')
    branchName: string,
    @Args('screenshotName')
    screenshotName: string,
    @Args('message')
    message: string,
  ) {
    return this.branchScreenshotService.approveBranchScreenshot({
      branchName,
      screenshotName,
      message,
    });
  }
}
