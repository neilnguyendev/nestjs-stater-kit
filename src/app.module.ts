import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { UserNotExistsValidator } from './validators/user-not-exists.validator';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './modules/mail/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestFilter } from './filters/bad-request.filter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.mysqlConfig,
      inject: [ApiConfigService],
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    UserNotExistsValidator,
    {
      provide: APP_FILTER,
      useClass: BadRequestFilter,
    },
  ],
})
export class AppModule {}
