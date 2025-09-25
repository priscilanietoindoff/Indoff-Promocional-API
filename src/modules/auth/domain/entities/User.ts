//Entidad de dominio para user solo refleja lo que un usuario y no depende de nada mas
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;            // uuid
  email: string;         // único
  passwordHash: string;  // hash de contraseña (bcrypt/argon2)
  role: Role;            // USER o ADMIN
  isVerified: boolean;   // si verificaste el correo
  createdAt: Date;
  updatedAt: Date;
}
