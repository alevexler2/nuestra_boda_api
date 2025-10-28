import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async getAllFromMiBoda() {
    try {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'mi_boda/',
        max_results: 1000,
      });

      const sortedResources = res.resources.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      return sortedResources.map((r) => {
        const match = r.display_name?.match(/_\*(.+)\*$/);
        const uploadedBy = match ? match[1] : 'Desconocido';
        const uploadedByCapitalized =
          uploadedBy.charAt(0).toUpperCase() + uploadedBy.slice(1);

        return {
          public_id: r.public_id,
          url: r.secure_url,
          format: r.format,
          type: r.resource_type,
          uploaded_by: uploadedByCapitalized,
        };
      });
    } catch (err) {
      console.error('Error al obtener recursos de Cloudinary:', err);
      throw new Error('No se pudieron obtener los archivos de mi_boda');
    }
  }
}
