import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type AccessTokenPayload, type TokenService } from '../../application/contracts/TokenService';
import { User } from '../../domain/entities/User';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwt: JwtService) {}

  async generateAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      role: user.role,
      email: user.email, // 👈 ahora incluido en el token
    };

    return this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwt.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }
}
