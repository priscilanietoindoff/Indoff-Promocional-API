import { Injectable } from '@nestjs/common';
import type { EmailSender } from '../../application/contracts/EmailSender';
import axios from 'axios';

@Injectable()
export class BrevoMailSender implements EmailSender {
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';
  private readonly apiKey = process.env.BREVO_API_KEY ?? '';

  async sendTemplate(params: {
    to: string;
    templateId: string | number;
    params: Record<string, unknown>;
  }): Promise<void> {
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY not configured');
    }

    const payload = {
      to: [{ email: params.to }],
      templateId: typeof params.templateId === 'string'
        ? Number(params.templateId)
        : params.templateId,
      params: params.params,
    };

    // 👉 Log antes de enviar
    console.log(
      '[BrevoMailSender] Enviando correo con template',
      payload.templateId,
      'a',
      params.to,
      'con params:',
      payload.params,
    );

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'api-key': this.apiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        timeout: 10000,
      });

      // 👉 Log respuesta de Brevo
      console.log('[BrevoMailSender] Respuesta OK:', response.data);
    } catch (err: any) {
      // 👉 Log error detallado
      console.error(
        '[BrevoMailSender] Error enviando correo:',
        err?.response?.data || err.message,
      );
      throw err;
    }
  }
}
