const payrollService = require("../services/payrollService");
const sseService = require("../services/sseService");

class PayrollController {
  async getAllPayrolls(req, res, next) {
    try {
      const { page = 1, limit = 10, keyword = "" } = req.query;

      console.log(
        `📋 Lấy danh sách bảng lương - Page: ${page}, Limit: ${limit}, Keyword: ${keyword}`
      );

      const result = await payrollService.getAllPayrolls(
        parseInt(page),
        parseInt(limit),
        keyword
      );

      console.log(`✅ Lấy được ${result.data.length} bản ghi`);
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách bảng lương:", error.message);
      next(error);
    }
  }

  async getPayrollByEmployeeId(req, res, next) {
    try {
      const { ma_nv } = req.params;
      const { user } = req; // Từ auth middleware

      console.log(
        `📋 User ${user.username} (${user.role}) đang tra cứu lương cho NV: ${ma_nv}`
      );

      // Kiểm tra quyền truy cập: Admin có thể xem tất cả, Employee chỉ xem của mình
      if (user.role === "employee" && user.username !== ma_nv) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Bạn chỉ có thể xem thông tin lương của chính mình",
        });
      }

      const result = await payrollService.getPayrollByEmployeeId(ma_nv);

      console.log(`✅ Tìm thấy thông tin lương cho NV: ${ma_nv}`);
      res.json(result);
    } catch (error) {
      console.error(
        `❌ Lỗi tra cứu lương cho NV ${req.params.ma_nv}:`,
        error.message
      );

      if (error.message.includes("Không tìm thấy")) {
        res.status(404).json({
          error: "Không tìm thấy",
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async signPayroll(req, res, next) {
    try {
      const { ma_nv } = req.params;
      const { ho_ten } = req.body;
      const { user } = req; // Từ auth middleware

      console.log(
        `✍️  User ${user.username} (${user.role}) đang ký tên xác nhận cho NV: ${ma_nv}`
      );

      // Kiểm tra quyền truy cập: Admin có thể ký cho tất cả, Employee chỉ ký cho chính mình
      if (user.role === "employee" && user.username !== ma_nv) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Bạn chỉ có thể ký xác nhận lương của chính mình",
        });
      }

      const result = await payrollService.signPayroll(ma_nv, ho_ten);

      console.log(`✅ Công nhân ${ma_nv} đã ký tên thành công`);

      // 📡 Emit SSE event for real-time updates
      sseService.emitPayrollSigned({
        ma_nv,
        ho_ten,
        ngay_ky: new Date(),
        ten_da_ky: ho_ten,
      });

      res.json(result);
    } catch (error) {
      console.error(`❌ Lỗi ký tên cho NV ${req.params.ma_nv}:`, error.message);

      if (error.message.includes("Không tìm thấy")) {
        res.status(404).json({
          error: "Không tìm thấy",
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async importExcel(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "File required",
          message: "Vui lòng chọn file Excel để import",
        });
      }

      console.log(`📁 Import file Excel: ${req.file.originalname}`);

      const result = await payrollService.importFromExcel(req.file.path);

      // Check for foreign key errors
      if (result.data.hasForeignKeyErrors) {
        console.log(`⚠️  Import có lỗi FK: ${result.data.errorCount} lỗi`);
        return res.status(400).json({
          error: "Foreign Key Constraint",
          message: result.message,
          data: result.data,
        });
      }

      console.log(
        `✅ Import thành công: ${result.data.successCount}/${result.data.totalRows} dòng`
      );
      res.json(result);
    } catch (error) {
      console.error("❌ Lỗi import Excel:", error.message);
      next(error);
    }
  }
}

module.exports = new PayrollController();
