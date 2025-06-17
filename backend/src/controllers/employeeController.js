const employeeService = require("../services/employeeService");

class EmployeeController {
  async getAllEmployees(req, res, next) {
    try {
      const { page = 1, limit = 10, keyword = "" } = req.query;

      console.log(
        `👥 Lấy danh sách nhân viên - Page: ${page}, Limit: ${limit}, Keyword: ${keyword}`
      );

      const result = await employeeService.getAllEmployees(
        parseInt(page),
        parseInt(limit),
        keyword
      );

      console.log(`✅ Lấy được ${result.data.length} nhân viên`);
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách nhân viên:", error.message);
      next(error);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const { ma_nv } = req.params;
      const { user } = req; // Từ auth middleware

      console.log(
        `👤 Lấy thông tin nhân viên: ${ma_nv} (User: ${user.username}, Role: ${user.role})`
      );

      // Kiểm tra quyền truy cập: Admin có thể xem tất cả, Employee chỉ xem của mình
      if (user.role === "employee" && user.username !== ma_nv) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Bạn chỉ có thể xem thông tin của chính mình",
        });
      }

      const result = await employeeService.getEmployeeById(ma_nv);

      console.log(`✅ Tìm thấy nhân viên: ${result.data.ho_ten}`);
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi lấy thông tin nhân viên:", error.message);
      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({
          error: "Not Found",
          message: error.message,
        });
      }
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const { ma_nv, ho_ten, cccd } = req.body;

      console.log(`➕ Tạo nhân viên mới: ${ma_nv} - ${ho_ten}`);

      const result = await employeeService.createEmployee({
        ma_nv,
        ho_ten,
        cccd,
      });

      console.log(`✅ Tạo nhân viên thành công: ${ma_nv}`);
      res.status(201).json(result);
    } catch (error) {
      console.error("❌ Lỗi tạo nhân viên:", error.message);
      if (
        error.message.includes("đã tồn tại") ||
        error.message.includes("bắt buộc")
      ) {
        return res.status(400).json({
          error: "Bad Request",
          message: error.message,
        });
      }
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const { ma_nv } = req.params;
      const { ho_ten, cccd } = req.body;

      console.log(`✏️  Cập nhật nhân viên: ${ma_nv}`);

      const result = await employeeService.updateEmployee(ma_nv, {
        ho_ten,
        cccd,
      });

      console.log(`✅ Cập nhật nhân viên thành công: ${ma_nv}`);
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi cập nhật nhân viên:", error.message);
      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({
          error: "Not Found",
          message: error.message,
        });
      }
      if (error.message.includes("Không có dữ liệu")) {
        return res.status(400).json({
          error: "Bad Request",
          message: error.message,
        });
      }
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const { ma_nv } = req.params;

      console.log(`🗑️  Xóa nhân viên: ${ma_nv}`);

      const result = await employeeService.deleteEmployee(ma_nv);

      console.log(`✅ Xóa nhân viên thành công: ${ma_nv}`);
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi xóa nhân viên:", error.message);
      if (error.message.includes("Không tìm thấy")) {
        return res.status(404).json({
          error: "Not Found",
          message: error.message,
        });
      }
      if (error.message.includes("Không thể xóa")) {
        return res.status(400).json({
          error: "Bad Request",
          message: error.message,
        });
      }
      next(error);
    }
  }
}

module.exports = new EmployeeController();
