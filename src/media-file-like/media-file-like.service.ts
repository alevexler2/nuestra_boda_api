import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaFileLikeRepository } from './media-file-like.repository';
import { MediaFileLike } from './entities/media-file-like.entity';
import { CreateMediaFileLikeDto } from './dto/create-media-file-like.dto';

@Injectable()
export class MediaFileLikeService {
  constructor(private readonly likeRepo: MediaFileLikeRepository) {}

   async create(createDto: CreateMediaFileLikeDto): Promise<MediaFileLike> {
    const { MediaFileID, UserEmail } = createDto;

    const existingLike = await this.likeRepo.findOneByUserAndMediaFile(MediaFileID, UserEmail);

    if (existingLike) {
      await this.likeRepo.deleteByUserAndMediaFile(MediaFileID, UserEmail);
      return existingLike
    }

    return this.likeRepo.create(createDto);
  }

  async findAllByMediaFile(mediaFileID: string): Promise<MediaFileLike[]> {
    return this.likeRepo.findAllByMediaFile(mediaFileID);
  }

  async findOne(id: string): Promise<MediaFileLike | null> {
    return this.likeRepo.findOne(id);
  }
}
