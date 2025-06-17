import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: parseInt(configService.get('DB_PORT', '3306')),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_DATABASE', 'quan_ly_luong'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Disable auto-sync to prevent schema conflicts
  logging: configService.get('NODE_ENV') === 'development',
  charset: 'utf8mb4',
  timezone: '+07:00',
  retryAttempts: 3,
  retryDelay: 3000,
  autoLoadEntities: true,
});
