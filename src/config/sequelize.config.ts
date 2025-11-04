import { EventSettings } from '@/event-settings/entities/event-setting.entity';
import { MediaFileComment } from '@/media-file-comment/entities/media-file-comment.entity';
import { MediaFileLike } from '@/media-file-like/entities/media-file-like.entity';
import { MediaFile } from '@/media-file/entities/media-file.entity';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { MediaType } from 'src/media-type/entities/media-type.entity';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ...(process.env.POSTGRES_SSL && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
  models: [
    MediaType,
    EventSettings,
    MediaFile,
    MediaFileComment,
    MediaFileLike,
  ],
  autoLoadModels: true,
  retryAttempts: 10,
  retryDelay: 3000,
};
