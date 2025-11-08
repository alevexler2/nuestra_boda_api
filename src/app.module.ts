import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './config/sequelize.config';
import { MediaTypeModule } from './media-type/media-type.module';
import { seedMediaTypes } from './seeds/media-type.seed';
import { MediaFileModule } from './media-file/media-file.module';
import { EventSettingsModule } from './event-settings/event-settings.module';
import { MediaFileCommentModule } from './media-file-comment/media-file-comment.module';
import { MediaFileLikeModule } from './media-file-like/media-file-like.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    MediaTypeModule,
    MediaFileModule,
    EventSettingsModule,
    MediaFileCommentModule,
    MediaFileLikeModule,
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await this.seedDatabase();
  }
  
  private async seedDatabase() {
    try {
      await seedMediaTypes();
      console.log('✅ Seeding completed successfully');
    } catch (error) {
      console.error('❌ Error during database seeding:', error);
      process.exit(1);
    }
  }
}
