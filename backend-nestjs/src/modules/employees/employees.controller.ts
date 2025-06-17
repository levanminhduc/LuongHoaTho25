import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface CreateEmployeeDto {
  ma_nv: string;
  ho_ten: string;
  cccd: string;
}

interface UpdateEmployeeDto {
  ho_ten?: string;
  cccd?: string;
}

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhân viên' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Danh sách nhân viên' })
  async getAllEmployees(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword: string = '',
  ) {
    return this.employeesService.getAllEmployees(page, limit, keyword);
  }

  @Get(':ma_nv')
  @ApiOperation({ summary: 'Lấy thông tin nhân viên theo mã' })
  @ApiResponse({ status: 200, description: 'Thông tin nhân viên' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async getEmployeeById(@Param('ma_nv') ma_nv: string) {
    return this.employeesService.getEmployeeById(ma_nv);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo nhân viên mới' })
  @ApiResponse({ status: 201, description: 'Tạo nhân viên thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.createEmployee(createEmployeeDto);
  }

  @Put(':ma_nv')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async updateEmployee(
    @Param('ma_nv') ma_nv: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(ma_nv, updateEmployeeDto);
  }

  @Delete(':ma_nv')
  @ApiOperation({ summary: 'Xóa nhân viên' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  async deleteEmployee(@Param('ma_nv') ma_nv: string) {
    return this.employeesService.deleteEmployee(ma_nv);
  }
}
