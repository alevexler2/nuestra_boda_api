import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CloudinaryModule, DatabaseModule],
})
export class AppModule {}
