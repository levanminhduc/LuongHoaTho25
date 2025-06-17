import api from "./api";
import {
  PayrollListResponse,
  PayrollResponse,
  SignPayrollRequest,
  SignPayrollResponse,
  ImportResponse,
  PaginationParams,
} from "@/types";

export const payrollService = {
  async getAllPayrolls(
    params: PaginationParams = {}
  ): Promise<PayrollListResponse> {
    const response = await api.get<PayrollListResponse>("/payroll", { params });
    return response.data;
  },

  async getPayrollByEmployeeId(ma_nv: string): Promise<PayrollResponse> {
    const response = await api.get<PayrollResponse>(`/payroll/${ma_nv}`);
    return response.data;
  },

  async signPayroll(
    ma_nv: string,
    data: SignPayrollRequest
  ): Promise<SignPayrollResponse> {
    const response = await api.post<SignPayrollResponse>(
      `/payroll/${ma_nv}/sign`,
      data
    );
    return response.data;
  },

  async importExcel(file: File): Promise<ImportResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ImportResponse>(
      "/payroll/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
