import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body) {
    return this.authService.signup(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login(body.username, body.password);
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute(@Request() req) {
    return { message: 'This is a protected route', user: req.user };
  }
}
