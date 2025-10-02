//Generador de tokens pra verificacion y reset de password
//La implementacion utilizando un tercero vive en infraestructure
export interface RandomTokenGenerator {
  generate(length?: number): string;
}

export const AUTH_RANDOM_TOKEN_GENERATOR = Symbol('AUTH_RANDOM_TOKEN_GENERATOR');