import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaFileCommentDto } from './create-media-file-comment.dto';

export class UpdateMediaFileCommentDto extends PartialType(CreateMediaFileCommentDto) {}
