import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { SupabaseService } from './services/supabase.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthGuard, SupabaseStrategy, SupabaseService],
  exports: [JwtAuthGuard, JwtModule, SupabaseService],
})
export class AuthModule {}
