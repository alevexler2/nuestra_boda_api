export interface CloudinaryFileResponse {
  public_id: string;
  url: string;
  format: string;
  type: string;
  mediaType: 'image' | 'video';
  uploaded_by: string;
  ownerEmail: string;
  MediaFileID?: string;
}