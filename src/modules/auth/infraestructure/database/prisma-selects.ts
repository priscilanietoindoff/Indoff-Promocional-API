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
