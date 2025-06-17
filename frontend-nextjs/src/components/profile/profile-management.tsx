"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeeProfile {
  id: number;
  ma_nv: string;
  ho_ten: string;
  cccd: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  ho_ten: string;
  cccd: string;
}

export default function ProfileManagement() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ho_ten: "",
    cccd: "",
  });

  // Fetch profile data
  const fetchProfile = async () => {
    if (!token || !user?.username) {
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(
        "🔍 Fetching profile for user:",
        user.username,
        "role:",
        user.role
      );

      const response = await fetch(
        `http://localhost:4002/api/employees/${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Profile response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Profile data received:", data);
        setProfile(data.data);
        setFormData({
          ho_ten: data.data.ho_ten,
          cccd: data.data.cccd,
        });
      } else {
        const errorData = await response.json();
        console.error("❌ Profile fetch error:", errorData);
        setError(errorData.message || "Không thể tải thông tin cá nhân");
      }
    } catch (error) {
      console.error("❌ Profile fetch exception:", error);
      setError("Lỗi kết nối: " + error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !profile) return;

    try {
      const response = await fetch(
        `http://localhost:4002/api/employees/${profile.ma_nv}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Cập nhật thông tin thành công");
        setEditing(false);
        fetchProfile();
      } else {
        const data = await response.json();
        alert("Lỗi cập nhật: " + data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối: " + error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">👤 Thông tin cá nhân</h1>
            <p className="text-gray-600">Xem và cập nhật thông tin của bạn</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            ← Quay lại
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Thông tin nhân viên</span>
              {!editing && (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profile.ho_ten.charAt(0)}
                    </span>
                  </div>
                </div>

                {editing ? (
                  /* Edit Form */
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mã nhân viên
                      </label>
                      <Input
                        type="text"
                        value={profile.ma_nv}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Không thể thay đổi mã nhân viên
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Họ và tên
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.ho_ten}
                        onChange={(e) =>
                          setFormData({ ...formData, ho_ten: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số CCCD
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.cccd}
                        onChange={(e) =>
                          setFormData({ ...formData, cccd: e.target.value })
                        }
                        placeholder="Nhập số CCCD"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            ho_ten: profile.ho_ten,
                            cccd: profile.cccd,
                          });
                        }}
                      >
                        Hủy
                      </Button>
                      <Button type="submit">Lưu thay đổi</Button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mã nhân viên
                        </label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {profile.ma_nv}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Họ và tên
                        </label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {profile.ho_ten}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số CCCD
                        </label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {profile.cccd}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ngày tạo
                        </label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {new Date(profile.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
