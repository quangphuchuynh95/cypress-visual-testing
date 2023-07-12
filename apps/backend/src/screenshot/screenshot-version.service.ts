import { Injectable } from '@nestjs/common';
import { CreateScreenshotInput } from './dto/create-screenshot.input';
import { UpdateScreenshotInput } from './dto/update-screenshot.input';
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

  create(createScreenshotInput: CreateScreenshotInput) {
    return 'This action adds a new screenshot';
  }

  findOne(id: number) {
    return `This action returns a #${id} screenshot`;
  }

  update(id: number, updateScreenshotInput: UpdateScreenshotInput) {
    return `This action updates a #${id} screenshot`;
  }

  remove(id: number) {
    return `This action removes a #${id} screenshot`;
  }
}
