import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sqlConfigService = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  try {
    const { host, username, password, database } =
      await configService.get('sqlDb');
    const minPoolSize =
      Number(await configService.get('MYSQL_MIN_POOL_SIZE')) || 0;
    const maxPoolSize =
      Number(await configService.get('MYSQL_MAX_POOL_SIZE')) || 10;
    const acquireTimeout =
      Number(await configService.get('MYSQL_ACQUIRE_TIMEOUT')) || 30000;
    const idleTimeout =
      Number(await configService.get('MYSQL_IDLE_TIMEOUT')) || 10000;

    return {
      dialect: 'mysql',
      host,
      port: 3306,
      username,
      password,
      database,
      pool: {
        min: minPoolSize,
        max: maxPoolSize,
        acquire: acquireTimeout,
        idle: idleTimeout,
      },
      define: {
        version: true,
        underscored: true,
      },
      timezone: '+05:30',
      autoLoadModels: true,
      synchronize: true,
      logging: console.log,
    };
  } catch (error) {
    console.error('Database configuration error:', error);
    throw new Error('Failed to initialize Sequelize configuration.');
  }
};
