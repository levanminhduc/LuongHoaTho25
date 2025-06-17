import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { SalaryImport } from '../../entities/salary-import.entity';
import { SseModule } from '../../sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryImport]), SseModule],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
