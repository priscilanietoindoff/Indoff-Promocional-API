//Resultado de un login exitoso.
export interface LoginResultDto {
  accessToken: string;
  tokenType: 'Bearer'; // constante para claridad
  expiresIn: number;   // en segundos
}
