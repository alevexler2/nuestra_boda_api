import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
  Query,
  Headers,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFileService } from './media-file.service';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { google } from 'googleapis';

// Tipos MIME soportados
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mov'],
};

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

@Controller('media-file')
export class MediaFileController {
  constructor(private readonly mediaFileService: MediaFileService) {}

  @Get('oauth2callback')
  async oauth2callback(@Query('code') code: string) {
    if (!code) {
      return { message: 'No code provided' };
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CLIENT_REDIRECT,
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);

      return {
        message: 'Tokens obtenidos correctamente',
        tokens,
      };
    } catch (err) {
      console.error(err);
      return {
        message: 'Error al intercambiar el code por tokens',
        error: err,
      };
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const mediaTypeId = parseInt(body.MediaTypeID);
    
    // Validar que el tipo de archivo corresponda con el MediaTypeID
    const validMimeTypes =
      mediaTypeId === 1 ? ALLOWED_MIME_TYPES.image : ALLOWED_MIME_TYPES.video;

    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no válido. MIME: ${file.mimetype}. Tipos permitidos: ${validMimeTypes.join(', ')}`,
      );
    }

    const eventId = body.EventID;

    const driveResult = await this.mediaFileService.uploadToDrive(
      file,
      eventId,
    );

    const createDto = {
      MediaTypeID: mediaTypeId,
      UploadedBy: body.UploadedBy,
      UploadedByName: body.UploadedByName,
      EventID: eventId,
      URL: driveResult.fileId,
    };

    const mediaRecord = await this.mediaFileService.create(createDto);

    return {
      message: 'Archivo subido a Google Drive correctamente',
      driveId: driveResult.fileId,
      mediaRecord,
    };
  }

  @Get('event/:eventId')
  async findAllByEvent(
    @Param('eventId') eventId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<
    PaginatedResponseDto<MediaFileResponseDto & { streamUrl?: string }>
  > {
    return this.mediaFileService.findAllByEvent(eventId, paginationQuery);
  }

  @Get(':id/stream')
  async streamVideo(
    @Param('id') id: string,
    @Headers('range') range: string,
    @Res() res: any,
  ) {
    return this.mediaFileService.streamVideoFromDrive(id, res, range);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.mediaFileService.delete(id);
  }
}
