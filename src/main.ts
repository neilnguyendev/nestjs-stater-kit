import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { setupSwagger } from './docs/setup-swagger';
import { useContainer } from 'class-validator';
import { middleware as expressCtx } from 'express-ctx';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.select(SharedModule).get(ApiConfigService);

  app.use(expressCtx);

  // Setup validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // Blind Connection instance to Validator
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      transform: true,
    })
  ); // Config datatype of response if request is not valid

  setupSwagger(app);

  await app.listen(configService.appConfig.port);

  console.info(`Server running on ${await app.getUrl()}`);

  return app;
}

bootstrap();
