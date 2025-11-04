import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MediaTypeService } from './media-type.service';
import { MediaTypeResponseDto } from './dto/response-media-type.dto';

@Controller('media-type')
export class MediaTypeController {
  constructor(private readonly mediaTypeService: MediaTypeService) {}

  @Get()
  findAll(): Promise<MediaTypeResponseDto[]> {
    return this.mediaTypeService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MediaTypeResponseDto | null> {
    return this.mediaTypeService.findOne(id);
  }
}
