import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

// import { UserSubscriber } from '../../entity-subscribers/user-subscriber';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get mysqlConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
    const subscribers = [__dirname + '/../../modules/**/*.subscriber{.ts,.js}'];

    return {
      entities,
      migrations,
      subscribers,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'mysql',
      name: 'default',
      host: this.getString('MYSQL_HOST'),
      port: this.getNumber('MYSQL_PORT'),
      username: this.getString('MYSQL_USERNAME'),
      password: this.getString('MYSQL_PASSWORD'),
      database: this.getString('MYSQL_DB'),
      migrationsRun: false,
      logging: true,
    };
  }

  get authConfig() {
    return {
      jwtKey: this.getString('JWT_KEY'),
      accessExpirationTime: this.getNumber('JWT_ACCESS_EXPIRATION_TIME'),
      refreshExpirationTime: this.getNumber('JWT_REFRESH_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get lucidAPIUrl() {
    return this.getString('LUCID_API_URL');
  }

  get mailConfig() {
    return {
      host: this.getString('MAIL_HOST'),
      user: this.getString('MAIL_USER'),
      password: this.getString('MAIL_PASSWORD'),
      from: this.getString('MAIL_FROM'),
    };
  }

  get domain() {
    return this.getString('DOMAIN');
  }
}
