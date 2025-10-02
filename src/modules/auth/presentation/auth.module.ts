// src/modules/auth/presentation/auth.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

// Controllers (lo agregaremos en el siguiente paso)
import { AuthController } from './controllers/auth.controller';

// Infra (repo / security)
import { UserPrismaRepository } from '../infraestructure/database/UserPrismaRepository';
import { TokenPrismaRepository } from '../infraestructure/database/TokenPrismaRepository';
import { BcryptPasswordHasher } from '../infraestructure/security/BcryptPasswordHasher';
import { CryptoTokenGenerator } from '../infraestructure/security/CryptoTokenGenerator';
import { JwtTokenService } from '../infraestructure/security/JwtTokenService';
import { BrevoMailSender } from '../infraestructure/notifications/BrevoMailSender';

// Domain contract
import { AUTH_USER_REPOSITORY } from '../domain/repositories/UserRepository';
import { AUTH_TOKEN_REPOSITORY } from '../domain/repositories/TokenRepository';

// App contracts tokens
import { AUTH_PASSWORD_HASHER } from '../application/contracts/PasswordHasher';
import { AUTH_TOKEN_SERVICE } from '../application/contracts/TokenService';
import { AUTH_RANDOM_TOKEN_GENERATOR } from '../application/contracts/RandomTokenGenerator';
import { AUTH_EMAIL_SENDER } from '../application/contracts/EmailSender';

// Application use case
import { Login } from '../application/services/Login';
import { RolesGuard } from './guards/roles.guard';
import { Signup } from '../application/services/Signup';
import { RequestEmailVerification } from '../application/services/RequestEmailVerification';
import { VerifyEmail } from '../application/services/VerifyMail';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({})
],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_USER_REPOSITORY, useClass: UserPrismaRepository },
    { provide: AUTH_PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: AUTH_TOKEN_SERVICE, useClass: JwtTokenService },
    //Signup
    { provide: AUTH_TOKEN_REPOSITORY, useClass: TokenPrismaRepository },
    { provide: AUTH_RANDOM_TOKEN_GENERATOR, useClass: CryptoTokenGenerator },
    //Email
    { provide: AUTH_EMAIL_SENDER, useClass: BrevoMailSender },

    // Caso de uso
    Login,
    RolesGuard,
    Signup,
    RequestEmailVerification,
    VerifyEmail
  ],
})
export class AuthModule {}
