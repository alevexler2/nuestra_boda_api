import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MediaFileService } from './media-file.service';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { MediaFileResponseDto } from './dto/response-media-file.dto';

@Controller('media-file')
export class MediaFileController {
  constructor(private readonly mediaFileService: MediaFileService) {}

  @Post()
  async create(@Body() createDto: CreateMediaFileDto): Promise<MediaFileResponseDto> {
    return this.mediaFileService.create(createDto);
  }

  @Get('event/:eventId')
  async findAllByEvent(@Param('eventId') eventId: string): Promise<MediaFileResponseDto[]> {
    return this.mediaFileService.findAllByEvent(eventId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MediaFileResponseDto | null> {
    return this.mediaFileService.findOne(id);
  }
}
