import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));  // 전역으로 사용하기 위함

  await app.listen(process.env.PORT, () => console.log(`Application listening on port ${process.env.PORT}`));
}
bootstrap();
