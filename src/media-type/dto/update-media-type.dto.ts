import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaTypeDto } from './create-media-type.dto';

export class UpdateMediaTypeDto extends PartialType(CreateMediaTypeDto) {}
