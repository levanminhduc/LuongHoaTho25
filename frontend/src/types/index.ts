export interface User {
  username: string;
  role: "admin" | "employee";
  fullName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  role: "admin" | "employee";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Payroll {
  id: number;
  ma_nv: string;
  ho_ten: string;
  luong_cb: number;
  phu_cap: number;
  thue: number;
  thuc_linh: number;
  da_ky: number;
  ngay_ky?: string;
  ten_da_ky?: string;
}

export interface PayrollResponse {
  success: boolean;
  data: Payroll;
}

export interface PayrollListResponse {
  success: boolean;
  data: Payroll[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SignPayrollRequest {
  ho_ten: string;
}

export interface SignPayrollResponse {
  success: boolean;
  message: string;
  data: {
    ma_nv: string;
    ho_ten: string;
    ngay_ky: string;
  };
}

export interface ImportResponse {
  success: boolean;
  message: string;
  data: {
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  };
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

// Employee types
export interface Employee {
  id: number;
  ma_nv: string;
  ho_ten: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  ma_nv: string;
  ho_ten: string;
  cccd: string;
}

export interface UpdateEmployeeRequest {
  ho_ten?: string;
  cccd?: string;
}

export interface EmployeeResponse {
  success: boolean;
  message?: string;
  data: Employee;
}

export interface EmployeeListResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
