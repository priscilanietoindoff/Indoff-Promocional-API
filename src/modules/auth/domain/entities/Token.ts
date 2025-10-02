//Entidad de dominio para los tipos de token (verify o reset)
export type TokenType = 'EMAIL_VERIFY' | 'PASSWORD_RESET';

export interface Token {
    id: string;
    userId: string;
    type: TokenType;
    token: string;  // valor único que viaja por URL (no JWT)
    consumed: boolean;
    expiresAt: Date;
    createdAt: Date;
}