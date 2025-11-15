import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { MediaFileService } from './media-file.service';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import * as fs from 'fs';

@Controller('media-file')
export class MediaFileController {
  constructor(private readonly mediaFileService: MediaFileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'temp');
          fs.mkdirSync(uploadPath, { recursive: true }); 
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = uniqueSuffix + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const eventId = body.EventID;
    const eventFolder = join(process.cwd(), 'uploads', eventId);

    fs.mkdirSync(eventFolder, { recursive: true });

    const oldPath = file.path;
    const newPath = join(eventFolder, file.filename);
    fs.renameSync(oldPath, newPath);

    const relativeUrl = `/uploads/${eventId}/${file.filename}`;

    const createDto = {
      MediaTypeID: parseInt(body.MediaTypeID),
      UploadedBy: body.UploadedBy,
      UploadedByName: body.UploadedByName,
      EventID: eventId,
      URL: relativeUrl,
    };

    const mediaRecord = await this.mediaFileService.create(createDto);

    return {
      message: 'Archivo subido y registrado correctamente',
      fileUrl: relativeUrl,
      mediaRecord,
    };
  }

  @Get('event/:eventId')
  async findAllByEvent(
    @Param('eventId') eventId: string,
  ): Promise<(MediaFileResponseDto & { data?: string })[]> {
    return this.mediaFileService.findAllByEvent(eventId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.mediaFileService.delete(id);
  }
}
