# Guía Completa: Configuración de Google OAuth 2.0 para Nuestra Boda API

Esta guía te mostrará paso a paso cómo obtener las credenciales de Google OAuth 2.0 (Client ID, Client Secret y Refresh Token) para tu API.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Crear un Proyecto en Google Cloud Console](#paso-1-crear-un-proyecto-en-google-cloud-console)
3. [Paso 2: Habilitar Google Drive API](#paso-2-habilitar-google-drive-api)
4. [Paso 3: Crear Credenciales OAuth 2.0](#paso-3-crear-credenciales-oauth-20)
5. [Paso 4: Generar el Refresh Token](#paso-4-generar-el-refresh-token)
6. [Paso 5: Actualizar tu archivo .env](#paso-5-actualizar-tu-archivo-env)
7. [Verificación](#verificación)
8. [Solución de Problemas](#solución-de-problemas)

---

## 📌 Requisitos Previos

- Una cuenta de Google activa
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)
- Tu aplicación NestJS corriendo o lista para configurar

---

## Paso 1: Crear un Proyecto en Google Cloud Console

### 1.1 Acceder a Google Cloud Console

1. Abre tu navegador y dirígete a: **https://console.cloud.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Si es la primera vez, acepta los términos de servicio

### 1.2 Crear un nuevo proyecto

1. En la parte superior, verás un selector de proyectos (junto al logo de Google Cloud)
2. Haz clic en el **selector de proyecto** (que dirá "My First Project" o similar)
3. Haz clic en **"NEW PROJECT"** (Nuevo Proyecto)
4. Ingresa los siguientes datos:
   - **Project name**: `nuestra-boda-api` (o el nombre que prefieras)
   - **Organization**: Déjalo en blanco si no tienes una
5. Haz clic en **"CREATE"** (Crear)
6. Espera a que se cree el proyecto (puede tardar unos segundos)

### 1.3 Seleccionar el proyecto

Una vez creado, asegúrate de estar trabajando en el proyecto correcto:
- En el selector de proyectos (parte superior), debe mostrar `nuestra-boda-api`

---

## Paso 2: Habilitar Google Drive API

### 2.1 Acceder al marketplace de APIs

1. En el menú lateral izquierdo, haz clic en **APIs & Services** (APIs y Servicios)
2. Luego haz clic en **Library** (Biblioteca)

### 2.2 Buscar Google Drive API

1. En la barra de búsqueda, escribe: **Google Drive API**
2. El primer resultado será **Google Drive API** (con el ícono de carpeta)
3. Haz clic en él

### 2.3 Habilitar la API

1. Verás un botón azul que dice **"ENABLE"** (Habilitar)
2. Haz clic en él
3. Espera a que se habilite (verás un mensaje de confirmación)

---

## Paso 3: Crear Credenciales OAuth 2.0

### 3.1 Ir a la sección de credenciales

1. En el menú lateral izquierdo, haz clic en **APIs & Services** → **Credentials** (Credenciales)
2. Verás un botón azul que dice **"+ CREATE CREDENTIALS"** (+ Crear Credenciales)
3. Haz clic en él
4. Se abrirá un menú desplegable

### 3.2 Seleccionar el tipo de credencial

1. En el menú desplegable, selecciona **OAuth client ID** (ID de cliente OAuth)
2. Si te pide configurar la pantalla de consentimiento primero, haz clic en **"Configure Consent Screen"** (Configurar Pantalla de Consentimiento)

### 3.3 Configurar la Pantalla de Consentimiento

Si te pidieron configurar la pantalla de consentimiento:

1. Selecciona el tipo de usuario:
   - Para desarrollo, selecciona **External** (Externo)
   - Haz clic en **CREATE** (Crear)

2. Completa el formulario "OAuth consent screen":

   **OAuth consent screen:**
   - **App name**: `Nuestra Boda API`
   - **User support email**: Tu correo de Google
   - **Developer contact information**: Tu correo de Google
   - Haz clic en **SAVE AND CONTINUE** (Guardar y Continuar)

   **Scopes:**
   - No necesitas agregar scopes manualmente aquí (los agregaremos después)
   - Haz clic en **SAVE AND CONTINUE** (Guardar y Continuar)

   **Test users:**
   - Haz clic en **ADD USERS** (Agregar Usuarios)
   - Agrega tu correo de Google como usuario de prueba
   - Haz clic en **SAVE AND CONTINUE** (Guardar y Continuar)

3. Revisa el resumen y haz clic en **BACK TO DASHBOARD** (Volver al Panel)

### 3.4 Crear el ID de Cliente OAuth

1. Vuelve a **APIs & Services** → **Credentials** (Credenciales)
2. Haz clic nuevamente en **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Selecciona el tipo de aplicación:
   - **Application type**: `Web application` (Aplicación Web)
   - **Name**: `nuestra-boda-api-oauth-client` (o el nombre que prefieras)

4. En **Authorized JavaScript origins** (Orígenes autorizados de JavaScript), agrega:
   - `http://localhost:8000`
   - `http://localhost:3000`
   - `https://api.pupaeventos.com` (para producción)

5. En **Authorized redirect URIs** (URIs de redireccionamiento autorizados), agrega:
   - `http://localhost:8000/api/media-file/oauth2callback`
   - `http://localhost:3000/api/media-file/oauth2callback`
   - `https://api.pupaeventos.com/api/media-file/oauth2callback` (para producción)

6. Haz clic en **CREATE** (Crear)

7. Se abrirá una ventana modal con tus credenciales:
   - **Client ID**: Cópialo (lo necesitarás)
   - **Client Secret**: Cópialo (lo necesitarás)
   - Cierra la ventana dando clic en **OK**

### 3.5 Descargar las credenciales en JSON

1. En la lista de credenciales, verás tu nuevo **Web application**
2. Haz clic en el ícono de descarga (abajo a la derecha)
3. Guarda el archivo JSON en tu carpeta `credentials/` con el nombre:
   ```
   client_secret_1097366080802-ohlbvf6m8msanm21cqm1nk9t6jv5rau8.apps.googleusercontent.com.json
   ```

---

## Paso 4: Generar el Refresh Token

El refresh token es necesario para que tu API pueda acceder a Google Drive indefinidamente. Usaremos **Google OAuth 2.0 Playground**.

### 4.1 Acceder a OAuth 2.0 Playground

1. Ve a: **https://developers.google.com/oauthplayground/**
2. Es una herramienta oficial de Google para generar tokens

### 4.2 Configurar credenciales personalizadas

1. En la esquina superior derecha, haz clic en el ícono de **engranaje ⚙️** (Settings)
2. Marca la opción: **Use your own OAuth credentials** (Usa tus propias credenciales OAuth)
3. En los campos que aparecen:
   - **OAuth Client ID**: Pega el Client ID que obtuviste en el paso 3.5
   - **OAuth Client Secret**: Pega el Client Secret que obtuviste en el paso 3.5
4. Haz clic en **Close** (Cerrar)

### 4.3 Seleccionar Google Drive API

1. En el panel izquierdo, busca **Google Drive API v3**
2. Expande la sección haciendo clic en ella
3. Selecciona el scope: **https://www.googleapis.com/auth/drive** (permite acceso completo a Drive)
4. Haz clic en **Authorize APIs** (Autorizar APIs)

### 4.4 Aprobar el acceso

1. Se abrirá una ventana de Google pidiendo permiso
2. Selecciona tu cuenta de Google
3. **Importante**: Verás un mensaje de advertencia "This app isn't verified" (Esta aplicación no está verificada)
   - Haz clic en **Advanced** (Avanzado)
   - Luego haz clic en **Go to nuestra-boda-api (unsafe)** (Ir a nuestra-boda-api)
4. Marca la opción **"See, edit, create, and delete all of your Google Drive files"**
5. Haz clic en **Allow** (Permitir/Autorizar)

### 4.5 Obtener el Refresh Token

1. Vuelves a **OAuth 2.0 Playground**
2. En el panel derecho, verás una sección **"Step 2: Exchange authorization code for tokens"**
3. Haz clic en **"Exchange authorization code for tokens"** (Intercambiar código de autorización por tokens)
4. Se generarán los tokens
5. Busca el campo **refresh_token** en la respuesta JSON (en el lado derecho)
6. **Copia el valor completo del refresh_token** (será una cadena larga)

---

## Paso 5: Actualizar tu archivo .env

Ahora que tienes todas las credenciales, actualiza tu archivo `.env`:

```env
PORT=8000
DB_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=album
GOOGLE_APPLICATION_CREDENTIALS=./credentials/client_secret_1097366080802-ohlbvf6m8msanm21cqm1nk9t6jv5rau8.apps.googleusercontent.com.json

# Credenciales de Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CLIENT_REDIRECT=http://localhost:8000/api/media-file/oauth2callback

# Refresh Token (el que generaste en el paso 4)
GOOGLE_REFRESH_TOKEN=YOUR_REFRESH_TOKEN_HERE

# Configuración de Drive
GOOGLE_DRIVE_FOLDER_ID=my-drive

# URLs de la aplicación
API_BASE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Reemplaza:
- `YOUR_CLIENT_ID_HERE` → El Client ID del paso 3.5
- `YOUR_CLIENT_SECRET_HERE` → El Client Secret del paso 3.5
- `YOUR_REFRESH_TOKEN_HERE` → El Refresh Token del paso 4.5

---

## ✅ Verificación

Para asegurarte de que todo está configurado correctamente:

### 5.1 Verifica el archivo .env

```bash
cat .env
```

Asegúrate de que:
- ✅ `GOOGLE_CLIENT_ID` no esté vacío
- ✅ `GOOGLE_CLIENT_SECRET` no esté vacío
- ✅ `GOOGLE_REFRESH_TOKEN` no esté vacío
- ✅ `GOOGLE_CLIENT_REDIRECT` apunte a `http://localhost:8000/api/media-file/oauth2callback`

### 5.2 Inicia tu aplicación

```bash
npm run start:dev
```

Deberías ver:
```
🚀 Server running on http://localhost:8000
```

### 5.3 Prueba la subida de archivos

Usa Swagger para probar la subida de archivos:
1. Ve a **http://localhost:8000/api/docs**
2. Busca el endpoint de **Media Files** → **POST /media-file/upload**
3. Intenta subir un archivo
4. Si todo está correcto, se debería subir a Google Drive sin errores

---

## 🆘 Solución de Problemas

### Error: `invalid_grant`

**Causa**: El refresh token es inválido o ha expirado.

**Solución**:
- Regenera el refresh token siguiendo nuevamente el **Paso 4**
- Google revoca automáticamente los refresh tokens si no se usan durante 6 meses
- Asegúrate de copiar correctamente el token completo

### Error: `unauthorized_client`

**Causa**: El Client ID o Client Secret es incorrecto o no está configurado.

**Solución**:
- Verifica que en tu `.env` los valores coincidan exactamente con los de Google Cloud Console
- No debe haber espacios adicionales

### Error: `redirect_uri_mismatch`

**Causa**: El URI de redireccionamiento en tu código no coincide con los autorizados en Google Cloud Console.

**Solución**:
- Asegúrate de que `GOOGLE_CLIENT_REDIRECT` en `.env` coincida exactamente con uno de los URIs agregados en el paso 3.4
- Para desarrollo local, debe ser: `http://localhost:8000/api/media-file/oauth2callback`

### Error: `The caller does not have permission`

**Causa**: Tu cuenta de Google no tiene permiso para acceder a Google Drive.

**Solución**:
- Asegúrate de haber seleccionado el scope correcto en el paso 4.3
- Vuelve a autorizar en **OAuth 2.0 Playground**

### Los archivos no se suben a Google Drive

**Causa**: El refresh token es válido pero hay un problema con la configuración.

**Solución**:
1. Verifica que `GOOGLE_DRIVE_FOLDER_ID` está configurado correctamente
2. Revisa los logs de la aplicación para ver el error exacto
3. Asegúrate de que tu cuenta de Google tiene permisos de escritura en Google Drive

---

## 📚 Referencias Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Drive API Documentación](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [NestJS Google Drive Integration](https://docs.nestjs.com/)

---

## ✨ Notas Importantes

- **⚠️ Nunca compartas tu Client Secret ni Refresh Token en públicó**
- Los refresh tokens son secretos sensibles, protégelos en tu archivo `.env`
- Para producción, considera usar un servicio de gestión de secretos como AWS Secrets Manager o Google Secret Manager
- El refresh token no expira automáticamente a menos que:
  - No se use durante 6 meses
  - El usuario revoque manualmente el acceso
  - Cambies la contraseña de tu cuenta de Google
  - Revoques el acceso en tu cuenta de Google

---

## ⚙️ Problema: Refresh Token que Expira en 7 Días

### ¿Por qué ocurre esto?

Si ves en la respuesta de Google:
```json
{
  "refresh_token_expires_in": 604799,
  ...
}
```

El valor `604799` segundos equivale a **7 días**. Esto sucede cuando generas el token a través de **Google OAuth Playground** en desarrollo.

### Solución: Implementar Refresh Automático

Para evitar que el token expire, debes refrescarlo antes de que expire. Implementa este servicio en tu aplicación:

#### 1. Crear un servicio de Google Auth que refresque automáticamente

Crea el archivo `src/config/google-auth.service.ts`:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauth2Client;
  private tokenPath = './credentials/token.json';

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CLIENT_REDIRECT,
    );
  }

  onModuleInit() {
    // Carga el refresh token desde el archivo o .env
    this.loadTokens();
    
    // Refresca el token automáticamente cada 50 minutos
    setInterval(() => {
      this.refreshAccessToken();
    }, 50 * 60 * 1000);
  }

  private loadTokens() {
    // Si existe archivo de token guardado, úsalo
    if (fs.existsSync(this.tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf-8'));
      this.oauth2Client.setCredentials(tokens);
    } else {
      // Si no, usa el refresh token del .env
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }
  }

  private async refreshAccessToken() {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      // Guarda los nuevos tokens en archivo (incluye el nuevo refresh token si se genera)
      fs.writeFileSync(
        this.tokenPath,
        JSON.stringify(credentials),
      );

      // Actualiza el oauth2Client con los nuevos tokens
      this.oauth2Client.setCredentials(credentials);

      console.log('✅ Token de Google refrescado automáticamente');
    } catch (error) {
      console.error('❌ Error refrescando token de Google:', error.message);
    }
  }

  getAuthClient() {
    return this.oauth2Client;
  }
}
```

#### 2. Usar el servicio en tu `MediaFileService`

Modifica `src/media-file/media-file.service.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { GoogleAuthService } from 'src/config/google-auth.service';
import { google, drive_v3 } from 'googleapis';

@Injectable()
export class MediaFileService {
  private drive: drive_v3.Drive;

  constructor(
    private readonly mediaFileRepo: MediaFileRepository,
    private readonly googleAuthService: GoogleAuthService, // Inyecta el servicio
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // Obtén el cliente OAuth del servicio
    const oauth2Client = this.googleAuthService.getAuthClient();
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async uploadToDrive(
    file: Express.Multer.File,
    eventId: string,
  ): Promise<{ fileId: string }> {
    // Ya no necesitas llamar getAccessToken manualmente
    // El servicio lo maneja automáticamente
    const folderId = await this.getOrCreateEventFolder(this.drive, eventId);
    
    // ... resto del código
  }
}
```

#### 3. Registrar el servicio en tu módulo

Modifica `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { GoogleAuthService } from './config/google-auth.service';

@Module({
  providers: [GoogleAuthService],
  exports: [GoogleAuthService], // Exporta para que otros módulos lo usen
})
export class AppModule {}
```

### Alternativa: Endpoints de Autorización (Recomendado para Producción)

Para una solución más robusta en producción, crea un endpoint que maneje el flujo OAuth completo:

#### 1. Crear controlador de autenticación

```typescript
import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { GoogleAuthService } from 'src/config/google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('authorize')
  @Redirect()
  authorize() {
    const authUrl = this.googleAuthService.getAuthUrl();
    return { url: authUrl };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    const tokens = await this.googleAuthService.getTokensFromCode(code);
    // Guarda los tokens en tu BD
    return { message: 'Authorized successfully', tokens };
  }
}
```

#### 2. Agregar métodos en GoogleAuthService

```typescript
getAuthUrl() {
  return this.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
  });
}

async getTokensFromCode(code: string) {
  const { tokens } = await this.oauth2Client.getToken(code);
  this.oauth2Client.setCredentials(tokens);
  
  // Guarda en archivo o BD
  fs.writeFileSync(
    this.tokenPath,
    JSON.stringify(tokens),
  );
  
  return tokens;
}
```

### ✅ Resumen de soluciones

| Solución | Ventajas | Desventajas |
|----------|----------|-------------|
| **Refresh Automático (Opción 1)** | Fácil de implementar, funciona en desarrollo | Token sigue siendo de corta duración si no se usa |
| **Endpoints OAuth (Opción 2)** | Solución permanente, token nunca expira | Requiere flujo de autorización del usuario |

Para **desarrollo local**, usa la **Opción 1**. Para **producción**, usa la **Opción 2**.

---

**¿Necesitas ayuda?** Si encuentras problemas, verifica que hayas completado cada paso exactamente como se describe.
