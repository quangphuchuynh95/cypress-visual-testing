import { Module } from '@nestjs/common';
import { ImageDiffService } from './image-diff.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Module({
  providers: [ImageDiffService],
  imports: [AwsS3Module],
  exports: [ImageDiffService],
})
export class ImageDiffModule {}
