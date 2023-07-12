import { Module } from '@nestjs/common';
import { ImageDiffServiceService } from './image-diff-service.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Module({
  providers: [ImageDiffServiceService],
  imports: [AwsS3Module],
  exports: [ImageDiffServiceService],
})
export class ImageDiffServiceModule {}
