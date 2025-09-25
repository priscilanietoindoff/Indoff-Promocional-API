import { Injectable } from '@nestjs/common';
import { type AccessTokenPayload, type TokenService } from '../../application/contracts/TokenService';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret = process.env.JWT_ACCESS_SECRET!;
  // Nota: el TTL lo define el caso de uso (Login) y llega como ttlSeconds

  async signAccess(payload: AccessTokenPayload, ttlSeconds: number): Promise<string> {
    // Firmamos HS256 con expiración corta. iat/exp los calcula jsonwebtoken.
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.secret,
        { algorithm: 'HS256', expiresIn: ttlSeconds },
        (err, token) => (err || !token ? reject(err) : resolve(token))
      );
    });
  }
}
