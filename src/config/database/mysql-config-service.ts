import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sqlConfigService = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  const { host, username, password, database } = await configService.get(
    'sqlDb',
  );
  const minPoolSize = await configService.get('MYSQL_MIN_POOL_SIZE');
  const maxPoolSize = await configService.get('MYSQL_MAX_POOL_SIZE');
  const acquireTimeout = await configService.get('MYSQL_ACQUIRE_TIMEOUT');
  const idleTimeout = await configService.get('MYSQL_IDLE_TIMEOUT');

  return {
    dialect: 'mysql',
    host,
    port: 3306,
    username,
    password,
    database,
    pool: {
      min: parseInt(minPoolSize),
      max: parseInt(maxPoolSize),
      acquire: parseInt(acquireTimeout),
      idle: parseInt(idleTimeout),
    },
    define: {
      version: true,
      underscored: true,
    },
    timezone: '+05:30', // for writing to database
    autoLoadModels: true,
    synchronize: true,
    logging: console.log,
  };
};
