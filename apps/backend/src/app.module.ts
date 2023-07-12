import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScreenshotModule } from './screenshot/screenshot.module';
import { BranchModule } from './branch/branch.module';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Branch } from './branch/entities/branch.entity';
import { Screenshot } from './screenshot/entities/screenshot.entity';
import { ScreenshotVersion } from './screenshot/entities/screenshot-version.entity';
import { BranchScreenshotModule } from './branch-screenshot/branch-screenshot.module';
import { BranchScreenshot } from './branch-screenshot/entities/branch-screenshot.entity';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { ImageDiffServiceModule } from './image-diff-service/image-diff-service.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        //
        // host: configService.get('HOST'),
        // port: +configService.get('DB_PORT'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Branch, Screenshot, ScreenshotVersion, BranchScreenshot],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.graphql'),
    }),
    ScreenshotModule,
    BranchModule,
    BranchScreenshotModule,
    AwsS3Module,
    ImageDiffServiceModule,
  ],
})
export class AppModule {}
