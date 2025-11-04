import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MediaFileCommentService } from './media-file-comment.service';
import { CreateMediaFileCommentDto } from './dto/create-media-file-comment.dto';
import { MediaFileCommentResponseDto } from './dto/response-media-file-comment.dto';

@Controller('media-file-comment')
export class MediaFileCommentController {
  constructor(private readonly commentService: MediaFileCommentService) {}

  @Post()
  async create(
    @Body() createDto: CreateMediaFileCommentDto,
  ): Promise<MediaFileCommentResponseDto> {
    return this.commentService.create(createDto);
  }

  @Get('media-file/:mediaFileId')
  async findAllByMediaFile(
    @Param('mediaFileId') mediaFileId: string,
  ): Promise<MediaFileCommentResponseDto[]> {
    return this.commentService.findAllByMediaFile(mediaFileId);
  }
}
