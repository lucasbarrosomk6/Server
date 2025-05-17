import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscodeConsumer } from './transcode.consumer';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          enableTLSForSentinelMode: false,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'transcode',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, TranscodeConsumer],
})
export class AppModule {}
