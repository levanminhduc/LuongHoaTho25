import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Root endpoint' })
  @ApiResponse({ status: 200, description: 'Thông tin API' })
  getRoot() {
    return {
      message: 'Payroll Management API (NestJS)',
      version: '2.0.0',
      documentation: '/api/docs',
      health: '/api/health',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Trạng thái hệ thống' })
  getHealth() {
    return {
      status: 'OK',
      message: 'NestJS Server đang hoạt động',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
    };
  }
}
