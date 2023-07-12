import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import * as path from 'path';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3;
  private readonly bucket: string;
  private readonly cdnEndpoint: string;
  private readonly prefix: string;

  constructor(configService: ConfigService) {
    this.bucket = configService.get('S3_BUCKET_NAME', '');
    this.cdnEndpoint = configService.get('S3_CDN_ENDPOINT', '');
    this.prefix = configService.get('S3_KEY_PREFIX', '');
    this.s3Client = new S3({
      forcePathStyle: false,
      endpoint: configService.get('S3_ENDPOINT', ''),
      region: configService.get('S3_REGION', ''),
      credentials: {
        accessKeyId: configService.get('S3_SPACES_KEY', ''),
        secretAccessKey: configService.get('S3_SPACES_SECRET', ''),
      },
    });
  }

  public async uploadFile(fileKey: string, file: Buffer, publicRead = false) {
    const data = await this.s3Client.putObject({
      ACL: publicRead ? 'public-read' : 'private',
      Bucket: this.bucket,
      Key: this.prefixing(fileKey),
      Body: file,
    });
    return this.createUrl(fileKey);
  }

  public async getFile(fileKey: string) {
    const data = await this.s3Client.getObject({
      Key: this.prefixing(fileKey),
      Bucket: this.bucket,
    });
    if (!data.Body) {
      return null;
    }
    return data.Body.transformToByteArray().then((u) => Buffer.from(u));
  }

  public prefixing(fullPath: string) {
    return path.join(this.prefix, fullPath);
  }

  public createUrl(fullPath: string) {
    const url = new URL(this.cdnEndpoint);
    url.pathname = this.prefixing(fullPath);
    return url;
  }
}
