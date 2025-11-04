import { Expose } from 'class-transformer';

export class MediaTypeResponseDto {
  @Expose()
  ID: number;

  @Expose()
  Name: string;
}
