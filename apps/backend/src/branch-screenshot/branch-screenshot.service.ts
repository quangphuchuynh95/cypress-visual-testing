import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchScreenshot } from './entities/branch-screenshot.entity';
import { Branch } from '../branch/entities/branch.entity';
import { v1 as uuidv1 } from 'uuid';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { ScreenshotService } from '../screenshot/screenshot.service';
import { BranchService } from '../branch/branch.service';
import { ImageDiffServiceService } from '../image-diff-service/image-diff-service.service';
import { Screenshot } from '../screenshot/entities/screenshot.entity';

@Injectable()
export class BranchScreenshotService {
  constructor(
    @InjectRepository(BranchScreenshot)
    private branchScreenshotRepository: Repository<BranchScreenshot>,
    private imageDiffServiceService: ImageDiffServiceService,
    private awsS3Service: AwsS3Service,
    private screenshotService: ScreenshotService,
    private branchService: BranchService,
  ) {}

  async findAllFromScreenshot(screenshot: Screenshot) {
    return this.branchScreenshotRepository.find({
      where: {
        screenshot: {
          id: screenshot.id,
        },
      },
    });
  }

  async updateOrCreateBranchScreenshot({
    branchName,
    screenshotName,
    image,
  }: {
    branchName: string;
    screenshotName: string;
    image: Buffer;
  }) {
    const screenshot = await this.screenshotService.findOrCreateByNane(
      screenshotName,
    );

    const branch = await this.branchService.findOrCreateByNane(branchName);

    const fileKey = `${uuidv1()}.png`;

    await this.awsS3Service.uploadFile(fileKey, image, true);

    let branchScreenshot = await this.branchScreenshotRepository.findOne({
      where: {
        branch: {
          id: branch.id,
        },
        screenshot: {
          id: screenshot.id,
        },
      },
    });

    if (!branchScreenshot) {
      branchScreenshot = this.branchScreenshotRepository.create({
        branch: branch,
        screenshot: screenshot,
      });
    }
    branchScreenshot = this.branchScreenshotRepository.merge(branchScreenshot, {
      fileKey,
    });

    await this.updateScreenshotDiffData(branchScreenshot);

    await this.branchScreenshotRepository.save(branchScreenshot);

    return branchScreenshot;
  }

  public async findScreenshot(branchScreenshot: BranchScreenshot) {
    const data = await this.branchScreenshotRepository.findOne({
      where: {
        id: branchScreenshot.id,
      },
      relations: {
        screenshot: true,
      },
    });
    return data?.screenshot;
  }

  public async updateScreenshotDiffData(branchScreenshot: BranchScreenshot) {
    const screenshot =
      branchScreenshot.screenshot ??
      (await this.findScreenshot(branchScreenshot));
    if (!screenshot) {
      throw new Error("can't find the related screenshot");
    }
    const diffResult = await this.imageDiffServiceService.compareImages(
      screenshot.fileKey ?? null,
      branchScreenshot.fileKey,
    );

    if (diffResult) {
      branchScreenshot = this.branchScreenshotRepository.merge(
        branchScreenshot,
        diffResult,
      );
    }

    await this.branchScreenshotRepository.save(branchScreenshot);
  }

  public async approveBranchScreenshot({
    branchName,
    screenshotName,
  }: {
    branchName: string;
    screenshotName: string;
  }) {
    const branchScreenshot = await this.branchScreenshotRepository.findOne({
      where: {
        branch: {
          name: branchName,
        },
        screenshot: {
          name: screenshotName,
        },
      },
      relations: {
        screenshot: true,
        branch: true,
      },
    });
    if (!branchScreenshot || !branchScreenshot.screenshot) {
      return null;
    }
    await this.screenshotService.updateFileKey(
      branchScreenshot.screenshot,
      branchScreenshot.fileKey,
    );
    return branchScreenshot;
  }
}
