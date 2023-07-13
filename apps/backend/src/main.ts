import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { registerEnumType } from '@nestjs/graphql';
import { DiffStatus } from './image-diff/image-diff.service';
async function bootstrap() {
  registerEnumType(DiffStatus, {
    name: 'DiffStatus',
  });
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  await app.listen(8080);
}
bootstrap();
