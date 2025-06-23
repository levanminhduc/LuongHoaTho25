import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { Employee } from '../../entities/employee.entity';
import { SalaryImport } from '../../entities/salary-import.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, SalaryImport]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOAD_DIR', './uploads'),
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(
              null,
              `import-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, callback) => {
          if (
            file.mimetype.match(/\/(xlsx|xls)$/) ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'text/csv' ||
            file.originalname.match(/\.(xlsx|xls|csv)$/i)
          ) {
            callback(null, true);
          } else {
            callback(
              new Error(
                'Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV (.csv)',
              ),
              false,
            );
          }
        },
        limits: {
          fileSize: parseInt(configService.get('MAX_FILE_SIZE', '10485760')), // 10MB
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
