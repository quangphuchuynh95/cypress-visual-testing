import {
  Query,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { BranchScreenshotService } from './branch-screenshot.service';
import * as path from 'path';

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
