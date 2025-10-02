import { Prisma } from '@prisma/client';

/**
 * User (select)
 * tipamos el select con Prisma.validator para que TS valide campos.
 * Traemos SOLO lo necesario para login y firmado de token.
 */
export const userArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    email: true,
    passwordHash: true,
    role: true,
    isVerified: true,
    createdAt: true,
    updatedAt: true,
  },
});
export type UserRow = Prisma.UserGetPayload<typeof userArgs>;

export const tokenArgs = Prisma.validator<Prisma.TokenDefaultArgs>()({
  select: {
    id: true,
    userId: true,
    type: true,
    token: true,
    consumed: true,
    expiresAt: true,
    createdAt: true,
  },
});
export type TokenRow = Prisma.TokenGetPayload<typeof tokenArgs>;
