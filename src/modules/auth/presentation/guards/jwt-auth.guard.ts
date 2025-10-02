import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

type JwtPayload = { sub: string; role: 'USER' | 'ADMIN'; email: string; iat?: number; exp?: number };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'] ?? req.headers['Authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta header Authorization');
    }

    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
      req.user = { sub: payload.sub, role: payload.role, email: payload.email, iat: payload.iat, exp: payload.exp };
      return true;
    } catch (e: any) {
      // jwt expired, invalid signature, etc.
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
