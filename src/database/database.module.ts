import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { SequelizeModule, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { sequelizeConfig } from './sequelize.config';

@Module({
  imports: [SequelizeModule.forRoot(sequelizeConfig)],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      this.logger.log(`✅ Conexión SQLite establecida en: ${(sequelizeConfig as any).storage}`);
    } catch (err) {
      this.logger.error('❌ Error al conectar con la base de datos:', err);
      throw err;
    }
  }
}
