import { Controller, Get } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotVersionService } from './screenshot-version.service';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';

/**
 * TODO: need to check token
 */
@Controller('screenshot')
export class ScreenshotController {
  constructor(
    private readonly screenshotService: ScreenshotService,
    private readonly screenshotVersionService: ScreenshotVersionService,
  ) {}

  @Get('/')
  public async getScreenshot(@Query('name') name: string) {
    return this.screenshotService.findOneByNane(name);
  }
}
