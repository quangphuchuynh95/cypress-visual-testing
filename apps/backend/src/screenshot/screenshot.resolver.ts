import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ScreenshotService } from './screenshot.service';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotVersion } from './entities/screenshot-version.entity';
import { ScreenshotVersionService } from './screenshot-version.service';

@Resolver(() => Screenshot)
export class ScreenshotResolver {
  constructor(
    private readonly screenshotService: ScreenshotService,
    private readonly screenshotVersionService: ScreenshotVersionService,
  ) {}

  @Query(() => Screenshot, { name: 'screenshot', nullable: true })
  screenshot(@Args('name', { type: () => String }) name: string) {
    return this.screenshotService.findOneByNane(name);
  }

  @ResolveField(() => [ScreenshotVersion])
  versions(@Parent() screenshot: Screenshot) {
    return this.screenshotVersionService.findByScreenshot(screenshot);
  }
}
