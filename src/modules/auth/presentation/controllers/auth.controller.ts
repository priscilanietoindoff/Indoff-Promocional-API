import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import type { LoginDto } from '../../application/dtos/LoginDto';
import { Login } from '../../application/services/Login';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly login: Login) {}

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
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: CurrentUserPayload) {
    return { sub: user.sub, role: user.role, iat: user.iat, exp: user.exp };
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
