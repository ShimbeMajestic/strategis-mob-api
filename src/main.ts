import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { GqlBadRequestHandler } from './shared/exception/gql-bad-request.handler';
import * as firebaseAdmin from 'firebase-admin';
import { corsConfig } from './config/cors.config';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
    });
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const port = configService.getPort();
    const logger = new Logger('bootstrap');

    app.disable('x-powered-by');
    app.enableCors(corsConfig);
    app.use(json({ limit: '1gb' }));
    app.set('trust proxy', true); // trust reverse proxy (nginx)
    app.useGlobalFilters(new GqlBadRequestHandler());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port);
    logger.log(`Application started on port ${port}`);
}
bootstrap();
