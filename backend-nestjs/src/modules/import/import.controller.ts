import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Add interface for return type
interface ImportResponse {
  status: string;
  data: any;
  message: string;
}

@ApiTags('Import')
@Controller('import')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImportController {
  constructor(private importService: ImportService) {}

  @Post('salary')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import dữ liệu lương từ file Excel' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Import thành công' })
  @ApiResponse({ status: 400, description: 'Lỗi file hoặc dữ liệu' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async importSalary(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportResponse> {
    if (!file) {
      throw new HttpException(
        'Vui lòng chọn file để import',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.importService.importSalaryData(file);
      return {
        status: 'success',
        data: result,
        message: 'Xử lý file import thành công',
      };
    } catch (error) {
      throw new HttpException(
        `Lỗi import: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('template')
  @ApiOperation({ summary: 'Tải xuống file Excel mẫu' })
  @ApiResponse({ status: 200, description: 'File Excel mẫu' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async downloadTemplate(@Res() res: Response): Promise<void> {
    try {
      const buffer = await this.importService.generateExcelTemplate();

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="mau-import-luong.xlsx"',
      );
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      throw new HttpException(
        `Lỗi tạo file mẫu: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Lấy lịch sử import' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch sử import' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getImportHistory(): Promise<any> {
    try {
      const history = await this.importService.getImportHistory();
      return {
        status: 'success',
        data: history,
        message: 'Lấy lịch sử import thành công',
      };
    } catch (error) {
      throw new HttpException(
        `Lỗi lấy lịch sử: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi import' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async deleteImportRecord(@Param('id') id: number): Promise<any> {
    try {
      const result = await this.importService.deleteImportRecord(id);
      if (!result) {
        throw new HttpException('Không tìm thấy bản ghi', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'success',
        message: 'Xóa bản ghi thành công',
      };
    } catch (error) {
      throw new HttpException(
        `Lỗi xóa bản ghi: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
