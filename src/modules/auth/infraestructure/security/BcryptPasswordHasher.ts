import { Injectable } from '@nestjs/common';
import { type PasswordHasher } from '../../application/contracts/PasswordHasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
    async hash(plain: string): Promise<string> {
        // cost 12 balancea seguridad y performance
        const saltRounds = 12;
        return bcrypt.hash(plain, saltRounds);
    }

  async compare(plain: string, hash: string): Promise<boolean> {
    // bcrypt.compare ya maneja salts y timing-safe compare
    return bcrypt.compare(plain, hash);
  }
}
