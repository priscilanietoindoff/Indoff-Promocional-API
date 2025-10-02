import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import type { LoginDto } from '../../application/dtos/LoginDto';
import type { SignupDto } from '../../application/dtos/SignupDto';
import { Login } from '../../application/services/Login';
import { Signup } from '../../application/services/Signup';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { VerifyEmail } from '../../application/services/VerifyMail';
import { RequestEmailVerification } from '../../application/services/RequestEmailVerification';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: Login, 
    private readonly signup: Signup,
    private readonly verifyEmail: VerifyEmail,
    private readonly requestEmailVerification: RequestEmailVerification,
) {}

  @Post('login')
  async loginEndpoint(@Body() body: LoginDto) {
    if (!body?.email || !body?.password) {
      throw new HttpException('Email y password son requeridos', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    try {
      const result = await this.login.execute(body);
      // { accessToken, tokenType: 'Bearer', expiresIn }
      return result;
    } catch (err: any) {
      if (err?.message === 'INVALID_CREDENTIALS') {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      // verificación de email
      if (err?.message === 'USER_NOT_VERIFIED') {
        throw new HttpException('Cuenta no verificada', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('signup')
    async signupEndpoint(@Body() body: SignupDto) {
    // Validación mínima; luego puedes migrar a class-validator
    const email = (body?.email ?? '').trim();
    const password = body?.password ?? '';
    if (!email || !password) {
        throw new HttpException('Email y password son requeridos', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    try {
        const result = await this.signup.execute({
        email,
        password,
        firstName: body.firstName ?? null,
        lastName: body.lastName ?? null,
        });
        // Para pruebas: devolvemos el token de verificación (luego lo omites en prod)
        return result; // { userId, verificationToken, verificationExpiresAt }
    } catch (err: any) {
        if (err?.message === 'EMAIL_ALREADY_EXISTS') {
        throw new HttpException('El email ya está registrado', HttpStatus.CONFLICT);
        }
        if (err?.message === 'VALIDATION_ERROR') {
        throw new HttpException('Datos inválidos', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ============== VERIFY EMAIL ==============
  // Puedes hacerlo POST con body.token o GET con query ?token=
  @Post('verify-email')
    async verifyEmailEndpoint(@Body('token') token: string) {
        if (!token) {
        throw new HttpException('token requerido', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        try {
        await this.verifyEmail.execute({ token });
        return { message: 'Email verificado' };
        } catch (err: any) {
        if (err?.message === 'TOKEN_NOT_FOUND') {
            throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
        }
        if (err?.message === 'TOKEN_ALREADY_USED') {
            throw new HttpException('Token ya utilizado', HttpStatus.CONFLICT);
        }
        if (err?.message === 'TOKEN_EXPIRED') {
            // 410 Gone es semántico para recursos expirados
            throw new HttpException('Token expirado', HttpStatus.GONE);
        }
        throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============== RESEND VERIFICATION (opcional) ==============
  // Requiere estar logueado, pero aún no verificado. Rate-limit recomendado.
  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
    async resendVerification(
        @CurrentUser() user: CurrentUserPayload,
    ) {
        try {
        // Usa tu APP_BASE_URL y BREVO_VERIFY_TEMPLATE_ID desde process.env (en el caso de uso)
        const verifyBaseUrl = (process.env.APP_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000') + '/auth/verify';
        const templateId = Number(process.env.BREVO_VERIFY_TEMPLATE_ID ?? 1);

        await this.requestEmailVerification.execute({
            userId: user.sub,
            email: user.email,         // asegúrate de incluir 'email' en el payload del JWT si no lo tienes
            verifyBaseUrl,
            templateId,
        });

        return { message: 'Se ha reenviado el correo de verificación' };
        } catch (err: any) {
        throw new HttpException('Error interno', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: CurrentUserPayload) {
    return { sub: user.sub, role: user.role, email: user.email, iat: user.iat, exp: user.exp };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/ping')
  @Roles('USER') // solo usuarios normales
  userPing() {
    return { ok: true, only: 'USER' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/ping')
  @Roles('ADMIN') // solo admins
  adminPing() {
    return { ok: true, only: 'ADMIN' };
  }
}
