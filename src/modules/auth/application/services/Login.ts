import { Inject, Injectable } from '@nestjs/common';

import type { LoginDto } from '../dtos/LoginDto';
import type { LoginResultDto } from '../dtos/LoginResultDto';

import {
  AUTH_USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/UserRepository';

import {
  AUTH_PASSWORD_HASHER,
  type PasswordHasher,
} from '../contracts/PasswordHasher';

import {
  AUTH_TOKEN_SERVICE,
  type TokenService,
} from '../contracts/TokenService';

@Injectable()
export class Login {
  // Nivel 0: token de acceso de vida corta (15 min)
  private readonly accessTtlSeconds = 15 * 60;

  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly users: UserRepository,

    @Inject(AUTH_PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,

    @Inject(AUTH_TOKEN_SERVICE)
    private readonly tokens: TokenService,
  ) {}

  /**
   * Caso de uso: autenticar por email/password y emitir access token.
   * Errores semánticos:
   *  - INVALID_CREDENTIALS
   * (El mapeo a 401/403 lo hará la capa Presentation.)
   */
  async execute(input: LoginDto): Promise<LoginResultDto> {
    const { email, password } = input;

    // 1) Buscar usuario
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 2) Verificar contraseña
    const ok = await this.hasher.compare(password, user.passwordHash);
    if (!ok) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 3) (Opcional) Reglas mínimas (descomentar si decides aplicarlas)
    // if (!user.isVerified) {
    //   throw new Error('USER_NOT_VERIFIED');
    // }

    // 4) Firmar access token
    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.tokens.signAccess(
      payload,
      this.accessTtlSeconds,
    );

    // 5) Respuesta DTO
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTtlSeconds,
    };
  }
}
