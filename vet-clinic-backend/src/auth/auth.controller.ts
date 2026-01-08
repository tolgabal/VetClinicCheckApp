import { Controller, Post, Body, UnauthorizedException, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginuser-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    
    const user = await this.authService.validateUser(
      loginDto.identifier, 
      loginDto.password
    );

    
    if (!user) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    return this.authService.login(user);
  }

@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  
  const user = await this.userService.findOne(req.user.userId); 
  // NOT: Senin servisinde findById mi var findOne mı var kontrol et.
  return user;
}
}