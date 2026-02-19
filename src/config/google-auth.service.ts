import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private readonly logger = new Logger(GoogleAuthService.name);
  private oauth2Client;
  private tokenPath = path.join(process.cwd(), 'credentials', 'token.json');
  private refreshInterval: NodeJS.Timeout;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CLIENT_REDIRECT,
    );
  }

  onModuleInit() {
    this.logger.log('🔐 Inicializando Google Auth Service...');
    
    // Carga los tokens existentes o el refresh token del .env
    this.loadTokens();
    
    // Refresca el access token automáticamente cada 50 minutos
    // (El access token expira cada 1 hora, así que refrescamos antes)
    this.refreshInterval = setInterval(() => {
      this.refreshAccessToken();
    }, 50 * 60 * 1000);

    this.logger.log('✅ Google Auth Service inicializado correctamente');
  }

  /**
   * Carga los tokens desde archivo o desde variables de entorno
   */
  private loadTokens() {
    try {
      // Si existe archivo de token guardado, lo carga (tiene prioridad)
      if (fs.existsSync(this.tokenPath)) {
        this.logger.log('📂 Cargando tokens desde archivo...');
        const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf-8'));
        this.oauth2Client.setCredentials(tokens);
        this.logger.log('✅ Tokens cargados desde archivo');
        return;
      }

      // Si no existe archivo, usa el refresh token del .env
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        this.logger.log('📝 Cargando refresh token desde .env...');
        this.oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
        this.logger.log('✅ Refresh token cargado desde .env');
        return;
      }

      this.logger.warn('⚠️ No se encontró refresh token ni archivo de credenciales');
    } catch (error) {
      this.logger.error(
        '❌ Error cargando tokens:',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Refresca el access token automáticamente
   */
  private async refreshAccessToken() {
    try {
      this.logger.debug('🔄 Refrescando access token...');
      
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      // Crea el directorio si no existe
      const credDir = path.dirname(this.tokenPath);
      if (!fs.existsSync(credDir)) {
        fs.mkdirSync(credDir, { recursive: true });
      }

      // Guarda los nuevos tokens en archivo
      fs.writeFileSync(
        this.tokenPath,
        JSON.stringify(credentials, null, 2),
      );

      // Actualiza el oauth2Client con los nuevos tokens
      this.oauth2Client.setCredentials(credentials);

      this.logger.log('✅ Access token refrescado y guardado automáticamente');
    } catch (error) {
      this.logger.error(
        '❌ Error refrescando access token:',
        error.message,
      );
      // No lanzamos el error para no romper la aplicación,
      // solo lo registramos
    }
  }

  /**
   * Obtiene el cliente OAuth2 para usar en Google Drive
   */
  getAuthClient() {
    return this.oauth2Client;
  }

  /**
   * Genera una URL de autorización para nuevos usuarios
   */
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // Fuerza a mostrar la pantalla de consentimiento
      scope: [
        'https://www.googleapis.com/auth/drive', // Acceso completo a Drive
      ],
    });
  }

  /**
   * Intercambia el código de autorización por tokens
   */
  async getTokensFromCode(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Crea el directorio si no existe
      const credDir = path.dirname(this.tokenPath);
      if (!fs.existsSync(credDir)) {
        fs.mkdirSync(credDir, { recursive: true });
      }

      // Guarda los tokens en archivo
      fs.writeFileSync(
        this.tokenPath,
        JSON.stringify(tokens, null, 2),
      );

      this.logger.log('✅ Tokens obtenidos y guardados exitosamente');
      return tokens;
    } catch (error) {
      this.logger.error(
        '❌ Error obteniendo tokens del código:',
        error.message,
      );
      throw error;
    }
  }

  /**
   * Limpia los intervalos cuando se destruye el módulo
   */
  onModuleDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.logger.log('🛑 Google Auth Service destruido');
    }
  }
}
