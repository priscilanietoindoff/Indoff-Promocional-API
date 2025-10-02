//dto apra el registro lo que se pedira en el registro
export interface SignupDto {
    email: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
}