import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';
import { v1 as uuidv1 } from 'uuid';

export interface DiffResult {
  diffPixels?: number;
  diffFileKey?: string;
  diffMessage: string;
}

@Injectable()
export class ImageDiffServiceService {
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
      if (diffPixels > 0) {
        diffFileKey = `${uuidv1()}.png`;
        diffMessage = 'The image is difference with approved one';
        await this.awsS3Service.uploadFile(diffFileKey, diff.data, true);
      }
      return {
        diffPixels,
        diffFileKey,
        diffMessage,
      };
    } catch (e) {
      return {
        diffPixels: undefined,
        diffFileKey: undefined,
        diffMessage: String(e),
      };
    }
  }

  public async compareImages(
    originImage: string | Buffer | null,
    currentImage: string | Buffer | null,
  ) {
    if (!originImage || !currentImage) {
      return null;
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
      return null;
    }
    return this.compareImageBuffers(
      Buffer.from(originImageFile),
      Buffer.from(currentImageFile),
    );
  }
}
