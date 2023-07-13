import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { registerEnumType } from '@nestjs/graphql';
import { DiffStatus } from './image-diff/image-diff.service';
async function bootstrap() {
  registerEnumType(DiffStatus, {
    name: 'DiffStatus',
  });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
