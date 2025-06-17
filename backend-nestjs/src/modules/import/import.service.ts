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
            luong_cb: parseFloat(row['Lương CB']) || 0,
            phu_cap: parseFloat(row['Phụ cấp']) || 0,
            thue: parseFloat(row['Thuế']) || 0,
            thuc_linh: parseFloat(row['Thực lĩnh']) || 0,
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

  async generateExcelTemplate(): Promise<Buffer> {
    try {
      // Lấy dữ liệu nhân viên mẫu từ database
      const employees = await this.employeeRepository.find({
        take: 3,
        order: { ma_nv: 'ASC' },
      });

      // Tạo dữ liệu mẫu
      const templateData: any[] = [];

      // Thêm dữ liệu mẫu từ nhân viên thực tế
      if (employees.length > 0) {
        employees.forEach((emp, index) => {
          const sampleSalaries = [
            {
              luong_cb: 15000000,
              phu_cap: 3000000,
              thue: 1800000,
              thuc_linh: 16200000,
            },
            {
              luong_cb: 12000000,
              phu_cap: 2500000,
              thue: 1450000,
              thuc_linh: 13050000,
            },
            {
              luong_cb: 18000000,
              phu_cap: 3500000,
              thue: 2150000,
              thuc_linh: 19350000,
            },
          ];

          const salary = sampleSalaries[index] || sampleSalaries[0];

          templateData.push({
            'Mã NV': emp.ma_nv,
            'Họ tên': emp.ho_ten,
            'Lương CB': salary.luong_cb,
            'Phụ cấp': salary.phu_cap,
            Thuế: salary.thue,
            'Thực lĩnh': salary.thuc_linh,
          });
        });
      } else {
        // Fallback data nếu không có nhân viên trong DB
        templateData.push(
          {
            'Mã NV': 'NV001',
            'Họ tên': 'Nguyễn Văn An',
            'Lương CB': 15000000,
            'Phụ cấp': 3000000,
            Thuế: 1800000,
            'Thực lĩnh': 16200000,
          },
          {
            'Mã NV': 'NV002',
            'Họ tên': 'Trần Thị Bình',
            'Lương CB': 12000000,
            'Phụ cấp': 2500000,
            Thuế: 1450000,
            'Thực lĩnh': 13050000,
          },
          {
            'Mã NV': 'NV003',
            'Họ tên': 'Lê Văn Cường',
            'Lương CB': 18000000,
            'Phụ cấp': 3500000,
            Thuế: 2150000,
            'Thực lĩnh': 19350000,
          },
        );
      }

      // Tạo workbook và worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(templateData);

      // Thiết lập độ rộng cột
      const columnWidths = [
        { wch: 12 }, // Mã NV
        { wch: 20 }, // Họ tên
        { wch: 15 }, // Lương CB
        { wch: 12 }, // Phụ cấp
        { wch: 12 }, // Thuế
        { wch: 15 }, // Thực lĩnh
      ];
      worksheet['!cols'] = columnWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu Import Lương');

      // Tạo buffer từ workbook
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return buffer;
    } catch (error) {
      throw new BadRequestException(`Lỗi tạo file Excel mẫu: ${error.message}`);
    }
  }
}
