import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService], // Export để các module khác có thể sử dụng
})
export class SseModule {
  constructor() {
    console.log('🔧 SSE Module initialized');
  }
}
