import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';

const dbSeedFile = process.env.DB_PATH || "C:\\Users\\alejandro.vexler\\nuestaHistoria\\nuestraHistoria_api\\nuestra-historia-api\\album.db";

const dbDir = path.dirname(dbSeedFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// import { Address } from 'src/addresses/entities/address.entity';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: dbSeedFile,
  models: [
    // Address,
  ],
  retryAttempts: 5,
  retryDelay: 3000,
  logging: true,
  synchronize: true,
};
