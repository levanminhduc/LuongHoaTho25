import { Test, TestingModule } from '@nestjs/testing';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PayrollController', () => {
  let controller: PayrollController;
  let service: PayrollService;

  // Mock data
  const mockPayrollResponse = {
    success: true,
    data: {
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
    },
    message: 'Thông tin lương nhân viên EMP001',
  };

  const mockPaginatedResponse = {
    success: true,
    data: [mockPayrollResponse.data],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
    message: 'Lấy được 1 bản ghi lương',
  };

  const mockUser = {
    username: 'EMP001',
    role: 'employee',
  };

  const mockAdminUser = {
    username: 'ADMIN001',
    role: 'admin',
  };

  // Mock service
  const mockPayrollService = {
    getAllPayrolls: jest.fn(),
    getPayrollByEmployeeId: jest.fn(),
    signPayroll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollController],
      providers: [
        {
          provide: PayrollService,
          useValue: mockPayrollService,
        },
      ],
    }).compile();

    controller = module.get<PayrollController>(PayrollController);
    service = module.get<PayrollService>(PayrollService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPayrolls', () => {
    it('should return paginated payrolls with default parameters', async () => {
      mockPayrollService.getAllPayrolls.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.getAllPayrolls();

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockPayrollService.getAllPayrolls).toHaveBeenCalledWith(1, 10, '');
    });

    it('should return paginated payrolls with custom parameters', async () => {
      mockPayrollService.getAllPayrolls.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.getAllPayrolls(2, 5, 'EMP001');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockPayrollService.getAllPayrolls).toHaveBeenCalledWith(
        2,
        5,
        'EMP001',
      );
    });

    it('should handle service errors', async () => {
      mockPayrollService.getAllPayrolls.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getAllPayrolls()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getPayrollByEmployeeId', () => {
    it('should return payroll for valid employee ID', async () => {
      mockPayrollService.getPayrollByEmployeeId.mockResolvedValue(
        mockPayrollResponse,
      );

      const mockRequest = { user: mockUser };
      const result = await controller.getPayrollByEmployeeId(
        'EMP001',
        mockRequest,
      );

      expect(result).toEqual(mockPayrollResponse);
      expect(mockPayrollService.getPayrollByEmployeeId).toHaveBeenCalledWith(
        'EMP001',
        mockUser,
      );
    });

    it('should throw NotFoundException for invalid employee ID', async () => {
      mockPayrollService.getPayrollByEmployeeId.mockRejectedValue(
        new NotFoundException(
          'Không tìm thấy thông tin lương cho nhân viên: EMP999',
        ),
      );

      const mockRequest = { user: mockUser };
      await expect(
        controller.getPayrollByEmployeeId('EMP999', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for unauthorized access', async () => {
      mockPayrollService.getPayrollByEmployeeId.mockRejectedValue(
        new ForbiddenException(
          'Bạn chỉ có thể xem thông tin lương của chính mình',
        ),
      );

      const otherUser = { ...mockUser, username: 'EMP002' };
      const mockRequest = { user: otherUser };

      await expect(
        controller.getPayrollByEmployeeId('EMP001', mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signPayroll', () => {
    const signPayrollDto = {
      ma_nv: 'EMP001',
      ho_ten: 'Nguyen Van A',
    };

    const mockSignResponse = {
      success: true,
      data: {
        ...mockPayrollResponse.data,
        da_ky: 1,
        ngay_ky: new Date(),
        ten_da_ky: 'Nguyen Van A',
      },
      message: 'Nhân viên EMP001 đã ký xác nhận lương thành công',
    };

    it('should successfully sign payroll', async () => {
      mockPayrollService.signPayroll.mockResolvedValue(mockSignResponse);
      const mockRequest = { user: mockUser };

      const result = await controller.signPayroll(
        'EMP001',
        signPayrollDto,
        mockRequest,
      );

      expect(result).toEqual(mockSignResponse);
      expect(mockPayrollService.signPayroll).toHaveBeenCalledWith(
        'EMP001',
        'Nguyen Van A',
        mockUser,
      );
    });

    it('should allow admin to sign for any employee', async () => {
      mockPayrollService.signPayroll.mockResolvedValue(mockSignResponse);

      const mockRequest = { user: mockAdminUser };
      const result = await controller.signPayroll(
        'EMP001',
        signPayrollDto,
        mockRequest,
      );

      expect(result).toEqual(mockSignResponse);
      expect(mockPayrollService.signPayroll).toHaveBeenCalledWith(
        'EMP001',
        'Nguyen Van A',
        mockAdminUser,
      );
    });

    it('should throw ForbiddenException when employee tries to sign for others', async () => {
      mockPayrollService.signPayroll.mockRejectedValue(
        new ForbiddenException(
          'Bạn chỉ có thể ký xác nhận lương của chính mình',
        ),
      );

      const otherUser = { ...mockUser, username: 'EMP002' };
      const mockRequest = { user: otherUser };

      await expect(
        controller.signPayroll('EMP001', signPayrollDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when payroll not found', async () => {
      mockPayrollService.signPayroll.mockRejectedValue(
        new NotFoundException(
          'Không tìm thấy thông tin lương cho nhân viên: EMP999',
        ),
      );

      const invalidDto = { ...signPayrollDto, ho_ten: 'Test User' };
      const mockRequest = { user: mockUser };

      await expect(
        controller.signPayroll('EMP999', invalidDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        ma_nv: '', // Empty employee ID
        ho_ten: '',
      };

      const mockRequest = { user: mockUser };

      // This would typically be caught by validation pipes in real application
      await expect(
        controller.signPayroll('', invalidDto, mockRequest),
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected service errors gracefully', async () => {
      mockPayrollService.getAllPayrolls.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(controller.getAllPayrolls()).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should handle database connection errors', async () => {
      mockPayrollService.getPayrollByEmployeeId.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const mockRequest = { user: mockUser };
      await expect(
        controller.getPayrollByEmployeeId('EMP001', mockRequest),
      ).rejects.toThrow('Database connection failed');
    });
  });
});
