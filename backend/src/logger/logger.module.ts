import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export const LOGGER_TOKEN = 'LOGGER';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LOGGER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const loggerType = configService.get('LOGGER_TYPE') || 'dev';

        switch (loggerType) {
          case 'json':
            return new JsonLogger();
          case 'tskv':
            return new TskvLogger();
          default:
            return new DevLogger();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [LOGGER_TOKEN],
})
export class LoggerModule {}
