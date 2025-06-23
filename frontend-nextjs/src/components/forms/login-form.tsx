"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";

interface FormData {
  username: string;
  password: string;
  role: "admin" | "employee";
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    role: "admin",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const startTime = Date.now();
    console.log(
      "🚀 Login attempt started for:",
      formData.username,
      formData.role
    );

    try {
      let loginSuccess = false;

      // DISABLED: Mock login - use real backend instead
      // Mock login disabled to test real SSE with valid JWT tokens

      // Try NestJS first with quick timeout
      try {
        console.log("🔄 Trying NestJS backend...");
        const nestjsResponse = await fetch(
          "http://localhost:4002/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
            signal: AbortSignal.timeout(3000), // 3 second timeout for NestJS
          }
        );

        if (nestjsResponse.ok) {
          const data = await nestjsResponse.json();
          console.log("✅ NestJS Login success:", data);
          login(data.user, data.access_token);
          router.push("/dashboard");
          loginSuccess = true;
          return;
        }
      } catch (nestjsError) {
        console.log("⚠️ NestJS not available, trying Express.js...");
      }

      // Fallback to Express.js with optimized API client
      if (!loginSuccess) {
        console.log("🔄 Trying Express.js backend...");

        const data = await apiClient.post("/auth/login", formData, {
          timeout: 8000, // 8 second timeout
          retries: 1, // Only 1 retry for login
          cache: false, // Never cache login requests
        });

        console.log("✅ Express Login success:", data);
        login(data.user, data.token);
        router.push("/dashboard");
        loginSuccess = true;
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`❌ Login failed after ${duration}ms:`, error);

      if (
        error.message.includes("timeout") ||
        error.message.includes("AbortError")
      ) {
        setError("Kết nối quá chậm. Vui lòng kiểm tra mạng và thử lại.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Không thể kết nối server. Vui lòng thử lại.");
      } else {
        setError(
          error.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
        );
      }
    } finally {
      const duration = Date.now() - startTime;
      console.log(`⏱️ Total login time: ${duration}ms`);
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vai trò
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as "admin" | "employee",
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="admin">Quản trị viên</option>
          <option value="employee">Nhân viên</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.role === "admin" ? "Tên đăng nhập" : "Mã nhân viên"}
        </label>
        <Input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder={formData.role === "admin" ? "admin" : "NV001"}
          required
          disabled={isLoading}
          autoComplete="username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder={formData.role === "admin" ? "admin123" : "CCCD"}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Đang đăng nhập...</span>
          </div>
        ) : (
          "Đăng nhập"
        )}
      </Button>

      {/* Performance indicator */}
      {isLoading && (
        <div className="text-xs text-gray-500 text-center">
          Đang kết nối đến server...
        </div>
      )}
    </form>
  );
}
