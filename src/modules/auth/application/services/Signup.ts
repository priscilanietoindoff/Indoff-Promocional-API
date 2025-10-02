import { Inject, Injectable } from '@nestjs/common';

import type { SignupDto } from '../dtos/SignupDto';
import type { SignupResultDto } from '../dtos/SignupResultDto';

import {
  AUTH_USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/UserRepository';

import {
  AUTH_PASSWORD_HASHER,
  type PasswordHasher,
} from '../contracts/PasswordHasher';

import { RequestEmailVerification } from './RequestEmailVerification';

@Injectable()
export class Signup {
  private readonly verifyBaseUrl =
    (process.env.APP_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5173') + '/auth/verify';

  private readonly templateId =
    Number(process.env.BREVO_VERIFY_TEMPLATE_ID ?? 1);

  constructor(
    @Inject(AUTH_USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(AUTH_PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    private readonly requestEmailVerification: RequestEmailVerification,
  ) {}

  async execute(input: SignupDto): Promise<SignupResultDto> {
    const email = (input.email ?? '').trim().toLowerCase();
    const password = input.password ?? '';

    if (!email || !password) throw new Error('VALIDATION_ERROR');

    // 1) email único
    const exists = await this.users.findByEmail(email);
    if (exists) throw new Error('EMAIL_ALREADY_EXISTS');

    // 2) hash
    const passwordHash = await this.hasher.hash(password);

    // 3) crear user (isVerified=false)
    const user = await this.users.create({
      email,
      passwordHash,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      role: 'USER',
      isVerified: false,
    });

    // 4) generar + guardar token y enviar correo (UNA sola fuente de verdad)
    await this.requestEmailVerification.execute({
      userId: user.id,
      email: user.email,
      verifyBaseUrl: this.verifyBaseUrl,
      templateId: this.templateId,
    });
    // 5) Respuesta de QA (en prod NO devuelvas el token)
    return {message: 'Cuenta creada. Revisa tu correo para verificarla.'}
  }
}
