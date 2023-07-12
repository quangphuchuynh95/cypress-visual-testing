import { forwardRef, Module } from '@nestjs/common';
import { BranchScreenshotService } from './branch-screenshot.service';
import { BranchScreenshotResolver } from './branch-screenshot.resolver';
import { ScreenshotModule } from '../screenshot/screenshot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchScreenshot } from './entities/branch-screenshot.entity';
import { BranchScreenshotController } from './branch-screenshot.controller';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { BranchModule } from '../branch/branch.module';
import { BranchScreenshotSubscriber } from './subscribers/branch-screenshot.subscriber';
import { ImageDiffServiceModule } from '../image-diff-service/image-diff-service.module';

@Module({
  providers: [
    BranchScreenshotResolver,
    BranchScreenshotService,
    BranchScreenshotSubscriber,
  ],
  imports: [
    TypeOrmModule.forFeature([BranchScreenshot]),
    ImageDiffServiceModule,
    forwardRef(() => ScreenshotModule),
    BranchModule,
    AwsS3Module,
  ],
  exports: [BranchScreenshotService],
  controllers: [BranchScreenshotController],
})
export class BranchScreenshotModule {}
