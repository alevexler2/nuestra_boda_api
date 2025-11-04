import { MediaType } from '../media-type/entities/media-type.entity';

export async function seedMediaTypes() {
  const existing = await MediaType.count();

  if (existing > 0) {
    console.log('🌱 MediaType seed already exists, skipping...');
    return;
  }

  await MediaType.bulkCreate(
    [
      { Name: 'Image' },
      { Name: 'Video' },
    ] as any 
  );

  console.log('✅ MediaType seed created successfully');
}
