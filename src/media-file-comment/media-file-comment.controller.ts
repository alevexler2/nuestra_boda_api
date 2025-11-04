import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MediaFileCommentService } from './media-file-comment.service';
import { CreateMediaFileCommentDto } from './dto/create-media-file-comment.dto';
import { MediaFileCommentResponseDto } from './dto/response-media-file-comment.dto';
import { GetMediaFileCommentsDto } from './dto/get-media-file-comment.dto';

@Controller('media-file-comment')
export class MediaFileCommentController {
  constructor(private readonly commentService: MediaFileCommentService) {}

  @Post()
  async create(
    @Body() createDto: CreateMediaFileCommentDto,
  ): Promise<MediaFileCommentResponseDto> {
    return this.commentService.create(createDto);
  }

  @Get('media-file')
  async findAllByMediaFile(
     @Query() query: GetMediaFileCommentsDto,
  ): Promise<MediaFileCommentResponseDto[]> {
    return this.commentService.findAllByMediaFile(query.MediaFileID);
  }
}
