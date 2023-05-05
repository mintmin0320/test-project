import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));  // 전역으로 사용하기 위함
  // app.use(  //swagger 보안하기
  //   ['/api', '/api-json'],
  //   expressBasicAuth({
  //     challenge: true,
  //     users: {
  //       [process.env.SWAGGER_USER]: process.env.SWAGEER_PASSWORD,
  //     },
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('Test_Swagger')
    .setDescription('test study API description')
    .setVersion('1.0.0')
    .addTag('swagger')
    .build();

  // config를 바탕으로 swagger document 생성
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  // Swagger UI에 대한 path를 연결함
  // .setup('swagger ui endpoint', app, swagger_document)
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.ORIGIN,
    credentials: true,
  }
  );
  await app.listen(process.env.PORT, () => console.log(`Application listening on port ${process.env.PORT}`));
}
bootstrap();