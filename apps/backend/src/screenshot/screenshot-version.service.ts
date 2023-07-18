import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotVersion } from './entities/screenshot-version.entity';

@Injectable()
export class ScreenshotVersionService {
  constructor(
    @InjectRepository(ScreenshotVersion)
    private screenshotVersionRepository: Repository<ScreenshotVersion>,
  ) {}

  findByScreenshot(screenshot: Screenshot) {
    return this.screenshotVersionRepository.find({
      where: {
        screenshot: {
          id: screenshot.id,
        },
      },
    });
  }

  createVersion(screenshot: Screenshot, message: string) {
    return this.screenshotVersionRepository.save({
      screenshot: screenshot,
      fileKey: screenshot.fileKey,
      message,
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} screenshot`;
  // }
  //
  // update(id: number, updateScreenshotInput: UpdateScreenshotInput) {
  //   return `This action updates a #${id} screenshot`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} screenshot`;
  // }
}
