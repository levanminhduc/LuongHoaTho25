import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Employee } from '../../entities/employee.entity';
import { SalaryImport } from '../../entities/salary-import.entity';

interface ImportResult {
  success: boolean;
  message: string;
  processed: number;
  errors: string[];
  data?: any[];
}

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(SalaryImport)
    private salaryImportRepository: Repository<SalaryImport>,
  ) {}

  async importSalaryData(file: Express.Multer.File): Promise<ImportResult> {
    try {
      // Đọc file Excel
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (!data || data.length === 0) {
        throw new BadRequestException('File Excel không có dữ liệu');
      }

      const errors: string[] = [];
      const validData: any[] = [];

      // Validate và xử lý từng dòng dữ liệu
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        const rowNum = i + 2; // +2 vì Excel bắt đầu từ 1 và có header

        try {
          // Validate required fields
          if (!row['Mã NV'] || !row['Họ tên']) {
            errors.push(`Dòng ${rowNum}: Thiếu mã nhân viên hoặc họ tên`);
            continue;
          }

          // Kiểm tra nhân viên có tồn tại không
          const existingEmployee = await this.employeeRepository.findOne({
            where: { ma_nv: row['Mã NV'] },
          });

          if (!existingEmployee) {
            errors.push(
              `Dòng ${rowNum}: Không tìm thấy nhân viên với mã ${row['Mã NV']}`,
            );
            continue;
          }

          // Prepare data for import
          const importData = {
            ma_nv: row['Mã NV'],
            ho_ten: row['Họ tên'],
            chuc_vu: row['Chức vụ'] || '',
            phong_ban: row['Phòng ban'] || '',
            luong_co_ban: parseFloat(row['Lương cơ bản']) || 0,
            he_so_luong: parseFloat(row['Hệ số lương']) || 0,
            so_ngay_cong: parseInt(row['Số ngày công']) || 0,
            phu_cap: parseFloat(row['Phụ cấp']) || 0,
            thuong: parseFloat(row['Thưởng']) || 0,
            khau_tru: parseFloat(row['Khấu trừ']) || 0,
            luong_thuc_linh: parseFloat(row['Lương thực lĩnh']) || 0,
            file_name: file.originalname,
          };

          validData.push(importData);
        } catch (error) {
          errors.push(`Dòng ${rowNum}: ${error.message}`);
        }
      }

      // Save valid data
      if (validData.length > 0) {
        await this.salaryImportRepository.save(validData);
      }

      return {
        success: validData.length > 0,
        message:
          validData.length > 0
            ? `Import thành công ${validData.length} bản ghi`
            : 'Không có dữ liệu hợp lệ để import',
        processed: validData.length,
        errors,
        data: validData.length <= 10 ? validData : validData.slice(0, 10), // Return max 10 records for preview
      };
    } catch (error) {
      throw new BadRequestException(`Lỗi xử lý file: ${error.message}`);
    }
  }

  async getImportHistory(limit: number = 50): Promise<SalaryImport[]> {
    return this.salaryImportRepository.find({
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async deleteImportRecord(id: number): Promise<boolean> {
    const result = await this.salaryImportRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
