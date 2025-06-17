import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface SignPayrollDto {
  ho_ten: string;
}

@ApiTags('Payroll')
@Controller('payroll')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bảng lương' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Danh sách bảng lương' })
  async getAllPayrolls(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword: string = '',
  ) {
    return this.payrollService.getAllPayrolls(page, limit, keyword);
  }

  @Get(':ma_nv')
  @ApiOperation({ summary: 'Lấy thông tin lương theo mã nhân viên' })
  @ApiResponse({ status: 200, description: 'Thông tin lương nhân viên' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin lương' })
  async getPayrollByEmployeeId(
    @Param('ma_nv') ma_nv: string,
    @Request() req: any,
  ) {
    return this.payrollService.getPayrollByEmployeeId(ma_nv, req.user);
  }

  @Post(':ma_nv/sign')
  @ApiOperation({ summary: 'Ký xác nhận lương' })
  @ApiResponse({ status: 200, description: 'Ký xác nhận thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thông tin lương' })
  async signPayroll(
    @Param('ma_nv') ma_nv: string,
    @Body() signPayrollDto: SignPayrollDto,
    @Request() req: any,
  ) {
    console.log(
      `🎯 PayrollController: signPayroll called for ${ma_nv} by ${req.user?.username}`,
    );
    console.log(
      `🎯 PayrollController: About to call PayrollService.signPayroll`,
    );

    const result = await this.payrollService.signPayroll(
      ma_nv,
      signPayrollDto.ho_ten,
      req.user,
    );

    console.log(
      `🎯 PayrollController: PayrollService.signPayroll completed for ${ma_nv}`,
    );
    return result;
  }
}
