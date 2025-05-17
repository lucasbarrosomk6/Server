import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/transcode')
  @UseGuards(JwtAuthGuard)
  transcode(@Req() req: Request) {
    // The user is authenticated at this point
    const userId = req.user?.userId;
    return this.appService.transcode(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    // This is a protected route that requires authentication
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
