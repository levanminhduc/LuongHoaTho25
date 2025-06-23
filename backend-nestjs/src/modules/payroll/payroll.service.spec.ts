import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { SalaryImport } from '../../entities/salary-import.entity';
import { SseService } from '../../sse/sse.service';

describe('PayrollService', () => {
  let service: PayrollService;
  let repository: Repository<SalaryImport>;
  let sseService: SseService;

  // Mock data
  const mockSalaryImport = {
    id: 1,
    ma_nv: 'EMP001',
    ho_ten: 'Nguyen Van A',
    luong_co_ban: 10000000,
    phu_cap: 2000000,
    thuong: 1000000,
    tong_luong: 13000000,
    da_ky: 0,
    ngay_ky: null,
    ten_da_ky: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUser = {
    username: 'EMP001',
    role: 'employee',
  };

  const mockAdminUser = {
    username: 'ADMIN001',
    role: 'admin',
  };

  // Mock repository
  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock SSE service
  const mockSseService = {
    broadcastPayrollSigned: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        {
          provide: getRepositoryToken(SalaryImport),
          useValue: mockRepository,
        },
        {
          provide: SseService,
          useValue: mockSseService,
        },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    repository = module.get<Repository<SalaryImport>>(
      getRepositoryToken(SalaryImport),
    );
    sseService = module.get<SseService>(SseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPayrolls', () => {
    it('should return paginated payrolls without keyword', async () => {
      const mockPayrolls = [mockSalaryImport];
      const mockTotal = 1;

      mockRepository.findAndCount.mockResolvedValue([mockPayrolls, mockTotal]);

      const result = await service.getAllPayrolls(1, 10, '');

      expect(result).toEqual({
        success: true,
        data: mockPayrolls,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
        message: 'Lấy được 1 bản ghi lương',
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { created_at: 'DESC' },
      });
    });

    it('should return paginated payrolls with keyword search', async () => {
      const mockPayrolls = [mockSalaryImport];
      const mockTotal = 1;

      mockRepository.findAndCount.mockResolvedValue([mockPayrolls, mockTotal]);

      const result = await service.getAllPayrolls(1, 10, 'EMP001');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPayrolls);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          {
            ma_nv: expect.objectContaining({
              _type: 'like',
              _value: '%EMP001%',
            }),
          },
          {
            ho_ten: expect.objectContaining({
              _type: 'like',
              _value: '%EMP001%',
            }),
          },
        ],
        skip: 0,
        take: 10,
        order: { created_at: 'DESC' },
      });
    });

    it('should calculate pagination correctly', async () => {
      const mockPayrolls = Array(5).fill(mockSalaryImport);
      const mockTotal = 25;

      mockRepository.findAndCount.mockResolvedValue([mockPayrolls, mockTotal]);

      const result = await service.getAllPayrolls(2, 5, '');

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 25,
        totalPages: 5,
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 5, // (2-1) * 5
        take: 5,
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('getPayrollByEmployeeId', () => {
    it('should return payroll for employee viewing their own data', async () => {
      mockRepository.findOne.mockResolvedValue(mockSalaryImport);

      const result = await service.getPayrollByEmployeeId('EMP001', mockUser);

      expect(result).toEqual({
        success: true,
        data: mockSalaryImport,
        message: 'Thông tin lương nhân viên EMP001',
      });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { ma_nv: 'EMP001' },
        order: { created_at: 'DESC' },
      });
    });

    it('should return payroll for admin viewing any employee data', async () => {
      mockRepository.findOne.mockResolvedValue(mockSalaryImport);

      const result = await service.getPayrollByEmployeeId(
        'EMP001',
        mockAdminUser,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSalaryImport);
    });

    it('should throw ForbiddenException when employee tries to view other employee data', async () => {
      const otherUser = { ...mockUser, username: 'EMP002' };

      await expect(
        service.getPayrollByEmployeeId('EMP001', otherUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when payroll not found', async () => {
      const adminUser = { username: 'ADMIN001', role: 'admin' };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getPayrollByEmployeeId('EMP999', adminUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('signPayroll', () => {
    it('should successfully sign payroll for employee', async () => {
      const unsignedPayroll = { ...mockSalaryImport, da_ky: 0 };
      const signedPayroll = {
        ...mockSalaryImport,
        da_ky: 1,
        ngay_ky: expect.any(Date),
        ten_da_ky: 'Nguyen Van A',
      };

      mockRepository.findOne.mockResolvedValue(unsignedPayroll);
      mockRepository.save.mockResolvedValue(signedPayroll);

      const result = await service.signPayroll(
        'EMP001',
        'Nguyen Van A',
        mockUser,
      );

      expect(result).toEqual({
        success: true,
        data: signedPayroll,
        message: 'Nhân viên EMP001 đã ký xác nhận lương thành công',
      });

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...unsignedPayroll,
        da_ky: 1,
        ngay_ky: expect.any(Date),
        ten_da_ky: 'Nguyen Van A',
      });

      expect(mockSseService.broadcastPayrollSigned).toHaveBeenCalledWith({
        ma_nv: 'EMP001',
        ho_ten: 'Nguyen Van A',
        ngay_ky: expect.any(Date),
        ten_da_ky: 'Nguyen Van A',
      });
    });

    it('should allow admin to sign for any employee', async () => {
      const unsignedPayroll = { ...mockSalaryImport, da_ky: 0 };
      const signedPayroll = {
        ...mockSalaryImport,
        da_ky: 1,
        ngay_ky: expect.any(Date),
        ten_da_ky: 'Nguyen Van A',
      };

      mockRepository.findOne.mockResolvedValue(unsignedPayroll);
      mockRepository.save.mockResolvedValue(signedPayroll);

      const result = await service.signPayroll(
        'EMP001',
        'Nguyen Van A',
        mockAdminUser,
      );

      expect(result.success).toBe(true);
      expect(mockSseService.broadcastPayrollSigned).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when employee tries to sign for others', async () => {
      const otherUser = { ...mockUser, username: 'EMP002' };

      await expect(
        service.signPayroll('EMP001', 'Nguyen Van A', otherUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when payroll not found for signing', async () => {
      const adminUser = { username: 'ADMIN001', role: 'admin' };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.signPayroll('EMP999', 'Test User', adminUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle SSE service errors gracefully', async () => {
      const unsignedPayroll = { ...mockSalaryImport, da_ky: 0 };
      const signedPayroll = {
        ...mockSalaryImport,
        da_ky: 1,
        ngay_ky: expect.any(Date),
        ten_da_ky: 'Nguyen Van A',
      };

      mockRepository.findOne.mockResolvedValue(unsignedPayroll);
      mockRepository.save.mockResolvedValue(signedPayroll);
      mockSseService.broadcastPayrollSigned.mockImplementation(() => {
        throw new Error('SSE Error');
      });

      // Should not throw error even if SSE fails
      const result = await service.signPayroll(
        'EMP001',
        'Nguyen Van A',
        mockUser,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(signedPayroll);
    });
  });
});
