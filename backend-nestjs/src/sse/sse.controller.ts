import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { SseService } from './sse.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('SSE')
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('connect')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Establish SSE connection for real-time updates (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'SSE connection established' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async connect(
    @Query('token') token: string,
    @Res() res: Response,
    @Request() req: any,
  ) {
    try {
      console.log('📡 SSE: Received connection request from NestJS');

      // Get user from JWT (already validated by guard)
      const user = req.user;
      if (!user || user.role !== 'admin') {
        throw new HttpException('Admin access required', HttpStatus.FORBIDDEN);
      }

      const userId = user.username;

      // Add SSE connection using Express.js style
      const connection = this.sseService.addConnection(userId, res);

      if (!connection) {
        throw new HttpException(
          'Connection limit reached',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      console.log(`📡 SSE: Admin ${userId} connected successfully to NestJS`);
    } catch (error) {
      console.error('❌ SSE connection error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'SSE Connection Failed',
          message: 'Unable to establish SSE connection',
        });
      }
    }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SSE connection statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'SSE statistics' })
  getStats() {
    try {
      const stats = this.sseService.getStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('❌ Error getting SSE stats:', error.message);
      throw new HttpException(
        {
          error: 'Stats Error',
          message: 'Unable to retrieve SSE statistics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send test SSE event (Admin only - for testing)' })
  @ApiResponse({ status: 200, description: 'Test event sent' })
  sendTestEvent(@Body() body: { message?: string }, @Request() req: any) {
    try {
      const { message = 'Test SSE event from NestJS' } = body;
      const user = req.user;

      this.sseService.sendTestEvent(`${message} (sent by ${user.username})`);

      console.log(`✅ SSE: Test event sent by ${user.username}`);
      return {
        success: true,
        message: 'Test event sent successfully',
        data: { message, sender: user.username },
      };
    } catch (error) {
      console.error('❌ Error sending test event:', error.message);
      throw new HttpException(
        {
          error: 'Test Event Error',
          message: 'Unable to send test event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SSE event history (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event history' })
  async getHistory(@Query('limit') limit?: string) {
    try {
      const historyLimit = parseInt(limit || '50') || 50;
      const history = await this.sseService.getEventHistory(historyLimit);

      return {
        success: true,
        data: history,
        count: history.length,
      };
    } catch (error) {
      console.error('❌ Error getting SSE history:', error.message);
      throw new HttpException(
        {
          error: 'History Error',
          message: 'Unable to retrieve event history',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'SSE service health check' })
  @ApiResponse({ status: 200, description: 'SSE service is healthy' })
  healthCheck() {
    const stats = this.sseService.getStats();
    return {
      status: 'OK',
      service: 'NestJS SSE',
      timestamp: new Date().toISOString(),
      connections: stats.activeConnections,
    };
  }

  @Get('connect-public')
  @ApiOperation({ summary: 'Establish public SSE connection for testing' })
  @ApiResponse({
    status: 200,
    description: 'Public SSE connection established',
  })
  async connectPublic(@Res() res: Response) {
    try {
      console.log('📡 SSE: Received public connection request from NestJS');

      const userId = `public_${Date.now()}`;

      // Add SSE connection using Express.js style (no auth required)
      const connection = this.sseService.addConnection(userId, res);

      if (!connection) {
        throw new HttpException(
          'Connection limit reached',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      console.log(
        `📡 SSE: Public user ${userId} connected successfully to NestJS`,
      );
    } catch (error) {
      console.error('❌ SSE public connection error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'SSE Connection Failed',
          message: 'Unable to establish public SSE connection',
        });
      }
    }
  }

  @Post('test-public')
  @ApiOperation({ summary: 'Send test SSE event (Public - for testing)' })
  @ApiResponse({ status: 200, description: 'Test event sent' })
  sendPublicTestEvent(@Body() body: { message?: string }) {
    try {
      const { message = 'Public test SSE event from NestJS' } = body;

      this.sseService.sendTestEvent(message);

      console.log(`✅ SSE: Public test event sent: ${message}`);
      return {
        success: true,
        message: 'Public test event sent successfully',
        data: { message },
      };
    } catch (error) {
      console.error('❌ Error sending public test event:', error.message);
      throw new HttpException(
        {
          error: 'Public Test Event Error',
          message: 'Unable to send public test event',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
