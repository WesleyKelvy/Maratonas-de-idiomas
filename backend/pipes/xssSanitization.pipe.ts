import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Logger,
} from '@nestjs/common';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@Injectable()
export class XssSanitizationPipe implements PipeTransform {
  private readonly logger = new Logger(XssSanitizationPipe.name);

  // Lista de tipos que não devem ser sanitizados
  private readonly skipTypes = ['custom']; // @CurrentUser() usa 'custom'

  transform(value: any, metadata: ArgumentMetadata) {
    // Pula sanitização para decoradores customizados (como @CurrentUser)
    if (this.skipTypes.includes(metadata.type)) {
      return value;
    }

    if (!['body', 'query', 'param'].includes(metadata.type)) {
      return value;
    }

    // this.logger.log(`🔍 XSS Sanitization iniciado para: ${metadata.type}`);
    // this.logger.log(`📦 Valor recebido: ${JSON.stringify(value)}`);

    const sanitized = this.sanitize(value);

    // this.logger.log(`✅ Valor sanitizado: ${JSON.stringify(sanitized)}`);
    return sanitized;
  }

  private sanitize(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      const sanitized = purify.sanitize(value);
      if (value !== sanitized) {
        this.logger.warn(`⚠️ String sanitizada: "${value}" -> "${sanitized}"`);
      }
      return sanitized;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    if (typeof value === 'object') {
      const sanitizedObject = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          sanitizedObject[key] = this.sanitize(value[key]);
        }
      }
      return sanitizedObject;
    }

    return value;
  }
}
