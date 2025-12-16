import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Gidilmek istenen metodun veya class'ın üzerindeki 'Roles' etiketini oku
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Eğer hiçbir etiket yoksa (Örn: Herkese açık bir sayfa), geçişe izin ver
    if (!requiredRoles) {
      return true;
    }

    // 2. Request içindeki user objesini al
    const { user } = context.switchToHttp().getRequest();

    // 3. Kontrol: Kullanıcının rolü, izin verilen rollerden biri mi?
    // user?.role -> Token payload'ına 'role' adıyla koyduğumuz için burası 'role' olmalı.
    return requiredRoles.some((role) => user?.role === role);
  }
}