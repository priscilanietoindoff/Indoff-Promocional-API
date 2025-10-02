import type {Token, TokenType } from '../entities/Token';

//Contrato apra persistencia de tokens (verificacion y reset de password)

export interface TokenRepository {
    create(params: {
        userId: string;
        type: TokenType;
        token: string; //lo generara aleatorio una cadena de strings
        expiresAt: Date; //fecha en la que expira        
    }): Promise<Token>;

    //Busca por valor del token y de tipo devuelve null si no lo encuentra
    findByTokenAndType(token: string, type: TokenType): Promise<Token | null>;

    //Marca el token como consumido o invalido puede ser despue de cierta fecha si es generaod a mano etc
    markAsConsumed(id: string): Promise<void>;

    //Invalida todos los tokens de un usuario por tipo de token TODOS LOS TOKENS asi evitamos duplicados o dejar token activo
    invalidateByUserAndType(userId: string, type: TokenType): Promise<number>;
}

//Token para inyeccion de independencias
export const AUTH_TOKEN_REPOSITORY = Symbol('AUTH_TOKEN_REPOSITORY');