import { forwardRef, Module } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotResolver } from './screenshot.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screenshot } from './entities/screenshot.entity';
import { ScreenshotVersion } from './entities/screenshot-version.entity';
import { ScreenshotVersionService } from './screenshot-version.service';
import { ScreenshotController } from './screenshot.controller';
import { ScreenshotSubscriber } from './subscribers/screenshot.subscriber';
import { BranchScreenshotModule } from '../branch-screenshot/branch-screenshot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Screenshot, ScreenshotVersion]),
    forwardRef(() => BranchScreenshotModule),
  ],
  providers: [
    ScreenshotSubscriber,
    ScreenshotResolver,
    ScreenshotService,
    ScreenshotResolver,
    ScreenshotVersionService,
  ],
  exports: [ScreenshotService, ScreenshotVersionService],
  controllers: [ScreenshotController],
})
export class ScreenshotModule {}
