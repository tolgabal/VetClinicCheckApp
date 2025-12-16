import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// NestJS'in hazır 'jwt' stratejisini tetikleyen sınıf
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}