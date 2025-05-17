import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../services/supabase.service';
import { Request } from 'express';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // Verify the token with Supabase
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    try {
      await this.supabaseService.verifyToken(token);
      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      return null;
    }
  }
}
