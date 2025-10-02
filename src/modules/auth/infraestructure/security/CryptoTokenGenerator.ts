import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import type { RandomTokenGenerator } from '../../application/contracts/RandomTokenGenerator';

@Injectable()
export class CryptoTokenGenerator implements RandomTokenGenerator {
  generate(length: number): string {
    // Genera bytes aleatorios y conviértelos a base64url (URL-safe)
    return randomBytes(length)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
