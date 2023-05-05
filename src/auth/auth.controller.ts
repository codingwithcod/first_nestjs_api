import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto): Promise<User> {
    return this.authService.signup(body);
  }

  @Post('login')
  login(
    @Body() body: LoginDto,
  ): Promise<{ success: boolean; access_token: string }> {
    return this.authService.login(body);
  }
}
