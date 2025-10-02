//Envia un correo usando la plantilla d enuestro proveedor que ne este caso es Brevo
//Brevo template + {{ params.token }} y {{ params.link }}
export interface EmailSender {
    sendTemplate(params: {
        to: string;
        templateId: string | number;
        params: Record<string, unknown>;
    }): Promise<void>;
}

export const AUTH_EMAIL_SENDER = Symbol('AUTH_EMAIL_SENDER');
