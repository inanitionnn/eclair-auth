import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dtos';
import { AccessToken } from './types';
import { Public } from '../../shared/decorators';

@ApiTags('Auth')
@ApiExtraModels()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // #region Post
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<AccessToken> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerBody: RegisterDto): Promise<AccessToken> {
    return await this.authService.register(registerBody);
  }
  // #endregion Post
}
