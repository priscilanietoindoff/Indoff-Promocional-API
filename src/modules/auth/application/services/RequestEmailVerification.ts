import { Inject, Injectable } from '@nestjs/common';
import { AUTH_TOKEN_REPOSITORY, type TokenRepository } from '../../domain/repositories/TokenRepository';
import { AUTH_EMAIL_SENDER, type EmailSender } from '../contracts/EmailSender';
import { AUTH_RANDOM_TOKEN_GENERATOR, type RandomTokenGenerator } from '../contracts/RandomTokenGenerator';

type Args = {
  userId: string;
  email: string;
  verifyBaseUrl: string;                 // ej. https://indoffpro.com/auth/verify
  templateId: string | number;           // ID de plantilla en Brevo
  expiresInHours?: number;               // default 24
};

@Injectable()
export class RequestEmailVerification {
  constructor(
    @Inject(AUTH_TOKEN_REPOSITORY) private readonly tokens: TokenRepository,
    @Inject(AUTH_EMAIL_SENDER) private readonly mailer: EmailSender,
    @Inject(AUTH_RANDOM_TOKEN_GENERATOR) private readonly tokenGen: RandomTokenGenerator,
  ) {}

  async execute(args: Args): Promise<{ token: string; expiresAt: Date }> {
    const { userId, email, verifyBaseUrl, templateId } = args;
    const hours = args.expiresInHours ?? 24;

    // Invalida tokens previos del mismo tipo/usuario
    await this.tokens.invalidateByUserAndType(userId, 'EMAIL_VERIFY');

    // Genera token URL-safe desde el generador inyectado
    const token = this.tokenGen.generate(32);
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    // Persiste
    await this.tokens.create({
      userId,
      type: 'EMAIL_VERIFY',
      token,
      expiresAt,
    });

    // Link que irá en el correo (generalmente al front)
    const link = `${verifyBaseUrl}?token=${encodeURIComponent(token)}`;

    // Envía plantilla con params
    await this.mailer.sendTemplate({
      to: email,
      templateId,
      params: { token, link, expiresAt },
    });

    return { token, expiresAt };
  }
}
