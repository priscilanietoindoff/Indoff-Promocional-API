import { Inject, Injectable } from '@nestjs/common';
import { AUTH_TOKEN_REPOSITORY, type TokenRepository } from '../../domain/repositories/TokenRepository';
import { AUTH_USER_REPOSITORY, type UserRepository } from '../../domain/repositories/UserRepository';

type Args = { token: string };

@Injectable()
export class VerifyEmail {
  constructor(
    @Inject(AUTH_TOKEN_REPOSITORY) private readonly tokens: TokenRepository,
    @Inject(AUTH_USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  /**
   * Verifica el token de email. Lanza errores semánticos simples
   * que el controller traducirá a HTTP.
   */
  async execute({ token }: Args): Promise<{ ok: true }> {
    // 1) Busca token
    const t = await this.tokens.findByTokenAndType(token, 'EMAIL_VERIFY');
    if (!t) throw new Error('TOKEN_NOT_FOUND');

    // 2) Reglas: no consumido y no expirado
    if (t.consumed) throw new Error('TOKEN_ALREADY_USED');
    if (t.expiresAt.getTime() < Date.now()) throw new Error('TOKEN_EXPIRED');

    // 3) Marca usuario como verificado
    await this.users.markVerified(t.userId);

    // 4) Marca token como consumido
    await this.tokens.markAsConsumed(t.id);

    return { ok: true };
  }
}
