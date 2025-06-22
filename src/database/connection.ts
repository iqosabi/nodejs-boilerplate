import { DataSource } from 'typeorm';
import config from '@/utils/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  entities: [__dirname + '/../resources/**/model/*.entity{.ts,.js}'],
  synchronize: false,
  extra: {
    options: '-c timezone=Asia/Jakarta'
  },
  ssl: config.isProduction() ? { rejectUnauthorized: false } : false,
});

/**
 * Initialize database connection
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    console.info(`[DB] Trying to connect => ${config.DB_DATABASE}`);
    await AppDataSource.initialize();
    console.info(`[DB] ✅ Connected => ${config.DB_DATABASE} Success!`);
  } catch (error: any) {
    console.error(`[DB] ❌ Failed => ${config.DB_DATABASE} Failed! - ${error.message}`);
  }
};

/**
 * Handle Application Termination
 */
process.on('SIGINT', () => {
  if (AppDataSource.isInitialized) {
    AppDataSource.destroy().then(() => {
      console.info('[DB] Connection Closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
