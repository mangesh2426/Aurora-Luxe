import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('[RolesGuard] requiredRoles:', requiredRoles, 'user:', user);
    if (!user) {
      console.log('[RolesGuard] Access Denied: No user found in request');
      return false;
    }
    const hasRole = requiredRoles.includes(user.role);
    console.log('[RolesGuard] inclusion check:', hasRole, 'user.role:', user.role);
    return hasRole;
  }
}
