import {
  Query,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BranchScreenshotService } from './branch-screenshot.service';

@Controller('branch-screenshot')
export class BranchScreenshotController {
  constructor(private branchScreenshotService: BranchScreenshotService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createOne(
    @Query('screenshotName') screenshotName: string,
    @Query('branchName') branchName: string,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    const screen =
      await this.branchScreenshotService.updateOrCreateBranchScreenshot({
        branchName,
        screenshotName,
        image: image.buffer,
      });

    return screen;
  }
}
