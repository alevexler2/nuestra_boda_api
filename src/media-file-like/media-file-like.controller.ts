import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MediaFileLikeService } from './media-file-like.service';
import { CreateMediaFileLikeDto } from './dto/create-media-file-like.dto';
import { MediaFileLike } from './entities/media-file-like.entity';

@Controller('media-file-like')
export class MediaFileLikeController {
  constructor(private readonly likeService: MediaFileLikeService) {}

  @Post()
  async create(@Body() createDto: CreateMediaFileLikeDto): Promise<MediaFileLike> {
    return this.likeService.create(createDto);
  }

  @Get('media-file/:mediaFileID')
  async findAllByMediaFile(@Param('mediaFileID') mediaFileID: string): Promise<MediaFileLike[]> {
    return this.likeService.findAllByMediaFile(mediaFileID);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MediaFileLike | null> {
    return this.likeService.findOne(id);
  }
}
