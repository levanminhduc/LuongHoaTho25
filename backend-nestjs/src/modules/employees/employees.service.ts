import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from '../../entities/employee.entity';

interface CreateEmployeeDto {
  ma_nv: string;
  ho_ten: string;
  cccd: string;
}

interface UpdateEmployeeDto {
  ho_ten?: string;
  cccd?: string;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async getAllEmployees(
    page: number = 1,
    limit: number = 10,
    keyword: string = '',
  ) {
    const skip = (page - 1) * limit;

    const whereCondition = keyword
      ? [
          { ma_nv: Like(`%${keyword}%`) },
          { ho_ten: Like(`%${keyword}%`) },
          { cccd: Like(`%${keyword}%`) },
        ]
      : {};

    const [employees, total] = await this.employeeRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { ma_nv: 'ASC' },
    });

    return {
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      message: `Lấy được ${employees.length} nhân viên`,
    };
  }

  async getEmployeeById(ma_nv: string) {
    const employee = await this.employeeRepository.findOne({
      where: { ma_nv },
    });

    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
    }

    return {
      success: true,
      data: employee,
      message: `Thông tin nhân viên ${ma_nv}`,
    };
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const { ma_nv, ho_ten, cccd } = createEmployeeDto;

    // Kiểm tra mã nhân viên đã tồn tại
    const existingEmployee = await this.employeeRepository.findOne({
      where: { ma_nv },
    });

    if (existingEmployee) {
      throw new BadRequestException(`Mã nhân viên ${ma_nv} đã tồn tại`);
    }

    // Kiểm tra CCCD đã tồn tại
    const existingCCCD = await this.employeeRepository.findOne({
      where: { cccd },
    });

    if (existingCCCD) {
      throw new BadRequestException(`CCCD ${cccd} đã được sử dụng`);
    }

    const employee = this.employeeRepository.create({
      ma_nv,
      ho_ten,
      cccd,
      chuc_vu: 'Nhân viên', // Giá trị mặc định
      phong_ban: 'Chưa phân công', // Giá trị mặc định
      luong_co_ban: 0,
      he_so_luong: 1.0,
      so_ngay_cong: 0,
      phu_cap: 0,
      thuong: 0,
      khau_tru: 0,
      luong_thuc_linh: 0,
    });

    const savedEmployee = await this.employeeRepository.save(employee);

    return {
      success: true,
      data: savedEmployee,
      message: `Tạo nhân viên ${ma_nv} thành công`,
    };
  }

  async updateEmployee(ma_nv: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: { ma_nv },
    });

    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
    }

    // Kiểm tra CCCD nếu có cập nhật
    if (updateEmployeeDto.cccd && updateEmployeeDto.cccd !== employee.cccd) {
      const existingCCCD = await this.employeeRepository.findOne({
        where: { cccd: updateEmployeeDto.cccd },
      });

      if (existingCCCD) {
        throw new BadRequestException(
          `CCCD ${updateEmployeeDto.cccd} đã được sử dụng`,
        );
      }
    }

    Object.assign(employee, updateEmployeeDto);
    const updatedEmployee = await this.employeeRepository.save(employee);

    return {
      success: true,
      data: updatedEmployee,
      message: `Cập nhật nhân viên ${ma_nv} thành công`,
    };
  }

  async deleteEmployee(ma_nv: string) {
    const employee = await this.employeeRepository.findOne({
      where: { ma_nv },
    });

    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
    }

    await this.employeeRepository.remove(employee);

    return {
      success: true,
      message: `Xóa nhân viên ${ma_nv} thành công`,
    };
  }
}
