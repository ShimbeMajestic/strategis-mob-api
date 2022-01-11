import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { corsConfig } from './config/cors.config';
import { GqlBadRequestHandler } from './shared/exception/gql-bad-request.handler';
import * as admin from 'firebase-admin';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  const app = await NestFactory.create(AppModule);

  const port = configService.getPort();
  const logger = new Logger('bootstrap');

  // app.enableCors(corsConfig);
  app.useGlobalFilters(new GqlBadRequestHandler());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  logger.log(`Application started on port ${port}`);
}
bootstrap();
