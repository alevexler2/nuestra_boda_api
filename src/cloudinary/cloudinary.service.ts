import { MediaFileService } from '@/media-file/media-file.service';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryFileResponse } from './interface/CloudinaryRespone.interface';

@Injectable()
export class CloudinaryService {
  constructor(private readonly mediaFileService: MediaFileService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async getAllFromMiBoda() {
    try {
      const [imagesRes, videosRes] = await Promise.all([
        cloudinary.api.resources({
          type: 'upload',
          prefix: 'mi_boda/',
          max_results: 1000,
          resource_type: 'image',
        }),
        cloudinary.api.resources({
          type: 'upload',
          prefix: 'mi_boda/',
          max_results: 1000,
          resource_type: 'video',
        }),
      ]);

      const allResources = [...imagesRes.resources, ...videosRes.resources];

      const sortedResources = allResources.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      const results: CloudinaryFileResponse[] = [];

      for (const r of sortedResources) {
        const match = r.display_name?.match(/_\*(.+)\*$/);
        const uploadedBy = match ? match[1] : 'Desconocido';
        const uploadedByCapitalized =
          uploadedBy.charAt(0).toUpperCase() + uploadedBy.slice(1);
        const mediaType = r.resource_type === 'video' ? 'video' : 'image';

        const mediaRecord = await this.mediaFileService.findOneByUrl(
          r.secure_url,
        );

        results.push({
          public_id: r.public_id,
          url: r.secure_url,
          format: r.format,
          type: r.resource_type,
          mediaType,
          uploaded_by: uploadedByCapitalized,
          ownerEmail: mediaRecord?.dataValues?.UploadedBy || 'Desconocido',
          MediaFileID: mediaRecord?.dataValues.ID
        });
      }

      return results;
    } catch (err) {
      console.error('Error al obtener recursos de Cloudinary:', err);
      throw new Error('No se pudieron obtener los archivos de mi_boda');
    }
  }

  async deleteMediaFile(
    imageUrl: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const mediaRecord = await this.mediaFileService.findOneByUrl(imageUrl);
      if (!mediaRecord) {
        return { success: false, message: 'Registro no encontrado en la DB' };
      }

      const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^/.]+$/);
      if (!match) {
        return {
          success: false,
          message: 'No se pudo extraer public_id de la URL',
        };
      }
      const publicId = match[1];

      const resourceType = mediaRecord.dataValues.MediaTypeID === 2 ? 'video' : 'image';
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      await this.mediaFileService.delete(mediaRecord.ID);

      return { success: true, message: 'Archivo eliminado correctamente' };
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      return { success: false, message: 'Error al eliminar archivo' };
    }
  }
}
