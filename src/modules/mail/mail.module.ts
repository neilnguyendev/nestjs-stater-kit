import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ApiConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.mailConfig.host,
          secure: false,
          auth: {
            user: config.mailConfig.user,
            pass: config.mailConfig.password,
          },
        },
        defaults: {
          from: `"Lucid Beta App" <${config.mailConfig.from}>`,
        },
        template: {
          dir: __dirname + '/../../../modules/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
