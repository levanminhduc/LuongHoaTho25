import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SalaryImport } from '../../entities/salary-import.entity';
import { SseService } from '../../sse/sse.service';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(SalaryImport)
    private salaryImportRepository: Repository<SalaryImport>,
    private sseService: SseService,
  ) {
    console.log('🔧 PayrollService: Constructor called');
    console.log('🔧 PayrollService: SSE Service injected:', !!this.sseService);
    console.log('🔧 PayrollService: SSE Service type:', typeof this.sseService);
  }

  async getAllPayrolls(
    page: number = 1,
    limit: number = 10,
    keyword: string = '',
  ) {
    const skip = (page - 1) * limit;

    const whereCondition = keyword
      ? [{ ma_nv: Like(`%${keyword}%`) }, { ho_ten: Like(`%${keyword}%`) }]
      : {};

    const [payrolls, total] = await this.salaryImportRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: payrolls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      message: `Lấy được ${payrolls.length} bản ghi lương`,
    };
  }

  async getPayrollByEmployeeId(ma_nv: string, user: any) {
    // Kiểm tra quyền truy cập: Admin có thể xem tất cả, Employee chỉ xem của mình
    if (user.role === 'employee' && user.username !== ma_nv) {
      throw new ForbiddenException(
        'Bạn chỉ có thể xem thông tin lương của chính mình',
      );
    }

    const payroll = await this.salaryImportRepository.findOne({
      where: { ma_nv },
      order: { created_at: 'DESC' }, // Lấy bản ghi mới nhất
    });

    if (!payroll) {
      throw new NotFoundException(
        `Không tìm thấy thông tin lương cho nhân viên: ${ma_nv}`,
      );
    }

    return {
      success: true,
      data: payroll,
      message: `Thông tin lương nhân viên ${ma_nv}`,
    };
  }

  async signPayroll(ma_nv: string, ho_ten: string, user: any) {
    // Kiểm tra quyền truy cập: Admin có thể ký cho tất cả, Employee chỉ ký cho chính mình
    if (user.role === 'employee' && user.username !== ma_nv) {
      throw new ForbiddenException(
        'Bạn chỉ có thể ký xác nhận lương của chính mình',
      );
    }

    const payroll = await this.salaryImportRepository.findOne({
      where: { ma_nv },
      order: { created_at: 'DESC' }, // Lấy bản ghi mới nhất
    });

    if (!payroll) {
      throw new NotFoundException(
        `Không tìm thấy thông tin lương cho nhân viên: ${ma_nv}`,
      );
    }

    // Cập nhật thông tin ký xác nhận
    payroll.ngay_ky = new Date();
    payroll.ten_da_ky = ho_ten;

    const updatedPayroll = await this.salaryImportRepository.save(payroll);

    // 📡 Gửi thông báo real-time
    console.log(`🔧 DEBUG: About to broadcast SSE event for ${ma_nv}`);
    console.log(`🔧 DEBUG: SSE service available:`, !!this.sseService);

    if (
      this.sseService &&
      typeof this.sseService.broadcastPayrollSigned === 'function'
    ) {
      try {
        this.sseService.broadcastPayrollSigned({
          ma_nv: payroll.ma_nv,
          ho_ten: payroll.ho_ten,
          ngay_ky: payroll.ngay_ky,
          ten_da_ky: payroll.ten_da_ky,
        });
        console.log(`📡 DEBUG: SSE event broadcast successful for ${ma_nv}`);
      } catch (error) {
        console.error(`❌ DEBUG: SSE broadcast failed:`, error);
      }
    } else {
      console.error(`❌ DEBUG: SSE service or method not available`);
    }

    console.log(
      `✅ NestJS: Nhân viên ${ma_nv} đã ký tên thành công và gửi SSE event`,
    );

    return {
      success: true,
      data: updatedPayroll,
      message: `Nhân viên ${ma_nv} đã ký xác nhận lương thành công`,
    };
  }
}
