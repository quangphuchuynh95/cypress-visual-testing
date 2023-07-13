import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';
import { v1 as uuidv1 } from 'uuid';

export enum DiffStatus {
  ExactlyTheSame = 'ExactlyTheSame',
  MissingOriginFile = 'MissingOriginFile',
  FileReadingError = 'FileReadingError',
  NotTheSame = 'NotTheSame',
}

export interface DiffResult {
  diffStatus: DiffStatus;
  diffPixels?: number;
  diffFileKey?: string;
  diffMessage: string;
}

@Injectable()
export class ImageDiffService {
  constructor(private awsS3Service: AwsS3Service) {}

  public async compareImageBuffers(
    originImageBuffer: Buffer,
    currentImageBuffer: Buffer,
  ): Promise<DiffResult> {
    try {
      const originImage = PNG.sync.read(originImageBuffer);

      const { width, height } = originImage;
      const currentImage = PNG.sync.read(currentImageBuffer);

      const diff = new PNG({ width, height });

      const diffPixels = pixelmatch(
        originImage.data,
        currentImage.data,
        diff.data,
        width,
        height,
      );
      let diffFileKey: string | undefined;
      let diffMessage = '';
      let diffStatus: DiffStatus = DiffStatus.ExactlyTheSame;
      if (diffPixels > 0) {
        diffStatus = DiffStatus.NotTheSame;
        diffFileKey = `${uuidv1()}.png`;
        diffMessage = 'The image is difference with approved one';
        await this.awsS3Service.uploadFile(
          diffFileKey,
          PNG.sync.write(diff),
          true,
        );
      }
      return {
        diffStatus,
        diffPixels,
        diffFileKey,
        diffMessage,
      };
    } catch (e) {
      return {
        diffStatus: DiffStatus.NotTheSame,
        diffPixels: undefined,
        diffFileKey: undefined,
        diffMessage: String(e),
      };
    }
  }

  public async compareImages(
    originImage: string | Buffer | null,
    currentImage: string | Buffer | null,
  ): Promise<DiffResult> {
    if (!originImage || !currentImage) {
      return {
        diffStatus: DiffStatus.MissingOriginFile,
        diffPixels: 0,
        diffFileKey: undefined,
        diffMessage:
          'This is your first time you take this screenshot, need to approve it first',
      };
    }
    let originImageFile: Buffer | null;
    let currentImageFile: Buffer | null;
    if (typeof originImage === 'string') {
      originImageFile = await this.awsS3Service.getFile(originImage);
    } else {
      originImageFile = originImage;
    }
    if (typeof currentImage === 'string') {
      currentImageFile = await this.awsS3Service.getFile(currentImage);
    } else {
      currentImageFile = currentImage;
    }
    if (!originImageFile || !currentImageFile) {
      return {
        diffStatus: DiffStatus.FileReadingError,
        diffPixels: 0,
        diffFileKey: undefined,
        diffMessage: 'There is a problem when reading image files',
      };
    }
    return this.compareImageBuffers(
      Buffer.from(originImageFile),
      Buffer.from(currentImageFile),
    );
  }
}
