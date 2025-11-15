export class MediaFileResponseDto {
  ID: string;
  URL: string;
  MediaTypeID: number;
  UploadedBy: string;
  UploadedByName: string;
  EventID?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}