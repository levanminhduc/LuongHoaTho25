import api from './api';
import {
  Employee,
  EmployeeResponse,
  EmployeeListResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  PaginationParams,
} from '@/types';

class EmployeeService {
  private readonly baseUrl = '/employees';

  /**
   * Lấy danh sách nhân viên (Admin only)
   */
  async getEmployees(params?: PaginationParams): Promise<EmployeeListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.keyword) searchParams.append('keyword', params.keyword);

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<EmployeeListResponse>(url);
    return response.data;
  }

  /**
   * Lấy thông tin nhân viên theo mã (Admin hoặc chính nhân viên đó)
   */
  async getEmployeeById(ma_nv: string): Promise<EmployeeResponse> {
    const response = await api.get<EmployeeResponse>(`${this.baseUrl}/${ma_nv}`);
    return response.data;
  }

  /**
   * Tạo nhân viên mới (Admin only)
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await api.post<EmployeeResponse>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Cập nhật thông tin nhân viên (Admin only)
   */
  async updateEmployee(ma_nv: string, data: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await api.put<EmployeeResponse>(`${this.baseUrl}/${ma_nv}`, data);
    return response.data;
  }

  /**
   * Xóa nhân viên (Admin only)
   */
  async deleteEmployee(ma_nv: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${ma_nv}`);
    return response.data;
  }

  /**
   * Lấy thông tin profile của nhân viên hiện tại
   */
  async getMyProfile(): Promise<EmployeeResponse> {
    // Lấy username từ token hoặc store
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.username) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    return this.getEmployeeById(user.username);
  }
}

export default new EmployeeService();
