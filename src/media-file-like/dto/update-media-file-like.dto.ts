import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaFileLikeDto } from './create-media-file-like.dto';

export class UpdateMediaFileLikeDto extends PartialType(CreateMediaFileLikeDto) {}
