import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'GIZLI_KELIME', // BURAYI .env DOSYASINDAN ALSAM DAHA İYİ OLUR Bİ ARA BAK
    });
  }

  // Token geçerliyse bu çalışır ve return ettiği değer 'request.user' olur
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role // Guard'larda bu rolü okuyacağım
    };
  }
}