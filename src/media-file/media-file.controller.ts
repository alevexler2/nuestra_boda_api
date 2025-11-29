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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFileService } from './media-file.service';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { google } from 'googleapis';

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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const eventId = body.EventID;

    const driveResult = await this.mediaFileService.uploadToDrive(
      file,
      eventId,
    );

    const createDto = {
      MediaTypeID: parseInt(body.MediaTypeID),
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
  ): Promise<PaginatedResponseDto<MediaFileResponseDto & { data?: string }>> {
    return this.mediaFileService.findAllByEvent(eventId, paginationQuery);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.mediaFileService.delete(id);
  }
}
