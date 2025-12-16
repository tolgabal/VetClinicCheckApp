import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule, // User bulmak için lazım
    PassportModule,
    JwtModule.register({
      secret: 'GIZLI_KELIME', // Strategy'deki ile AYNI OLMALI (.env kullanmalıyım)
      signOptions: { expiresIn: '1d' }, // Token 1 gün geçerli
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}