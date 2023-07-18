import { Injectable } from '@nestjs/common';
import { CreateScreenshotInput } from './dto/create-screenshot.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screenshot } from './entities/screenshot.entity';

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectRepository(Screenshot)
    private screenshotRepository: Repository<Screenshot>,
  ) {}

  findOneByNane(name: string): Promise<Screenshot | null> {
    return this.screenshotRepository.findOne({
      where: {
        name,
      },
    });
  }

  // findOneByID(id: number) {
  //   return this.screenshotRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  create(createScreenshotInput: CreateScreenshotInput) {
    return this.screenshotRepository.save(createScreenshotInput);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} screenshot`;
  // }

  updateFileKey(screenshot: Screenshot, fileKey: string, message: string) {
    screenshot.fileKey = fileKey;
    return this.screenshotRepository.save(screenshot, {
      data: {
        message,
      },
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} screenshot`;
  // }

  async findOrCreateByNane(name: string) {
    const screenshot = await this.findOneByNane(name);
    return screenshot || (await this.create({ name }));
  }
}
