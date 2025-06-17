const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

class EmployeeService {
  async getAllEmployees(page = 1, limit = 10, keyword = "") {
    try {
      // Ensure page and limit are integers
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      let query =
        "SELECT id, ma_nv, ho_ten, created_at, updated_at FROM nhan_vien";
      let countQuery = "SELECT COUNT(*) as total FROM nhan_vien";
      const params = [];
      const countParams = [];

      if (keyword && keyword.trim()) {
        query += " WHERE ma_nv LIKE ? OR ho_ten LIKE ?";
        countQuery += " WHERE ma_nv LIKE ? OR ho_ten LIKE ?";
        const searchTerm = `%${keyword.trim()}%`;
        params.push(searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm);
      }

      query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

      const [rows] = await pool.execute(query, params);
      const [countResult] = await pool.execute(countQuery, countParams);

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limitNum);

      return {
        success: true,
        data: rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(ma_nv) {
    try {
      const [rows] = await pool.execute(
        "SELECT id, ma_nv, ho_ten, created_at, updated_at FROM nhan_vien WHERE ma_nv = ?",
        [ma_nv]
      );

      if (rows.length === 0) {
        throw new Error(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
      }

      return {
        success: true,
        data: rows[0],
      };
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      const { ma_nv, ho_ten, cccd } = employeeData;

      // Validate required fields
      if (!ma_nv || !ho_ten || !cccd) {
        throw new Error("Mã nhân viên, họ tên và CCCD là bắt buộc");
      }

      // Check if employee already exists
      const [existing] = await pool.execute(
        "SELECT ma_nv FROM nhan_vien WHERE ma_nv = ?",
        [ma_nv]
      );

      if (existing.length > 0) {
        throw new Error(`Mã nhân viên ${ma_nv} đã tồn tại`);
      }

      // Hash CCCD
      const saltRounds = 10;
      const cccdHash = await bcrypt.hash(cccd, saltRounds);

      // Insert new employee
      const [result] = await pool.execute(
        "INSERT INTO nhan_vien (ma_nv, ho_ten, cccd_hash) VALUES (?, ?, ?)",
        [ma_nv, ho_ten, cccdHash]
      );

      return {
        success: true,
        message: "Tạo nhân viên thành công",
        data: {
          id: result.insertId,
          ma_nv,
          ho_ten,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(ma_nv, updateData) {
    try {
      const { ho_ten, cccd } = updateData;

      // Check if employee exists
      const [existing] = await pool.execute(
        "SELECT ma_nv FROM nhan_vien WHERE ma_nv = ?",
        [ma_nv]
      );

      if (existing.length === 0) {
        throw new Error(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
      }

      let query = "UPDATE nhan_vien SET ";
      const params = [];
      const updates = [];

      if (ho_ten) {
        updates.push("ho_ten = ?");
        params.push(ho_ten);
      }

      if (cccd) {
        const saltRounds = 10;
        const cccdHash = await bcrypt.hash(cccd, saltRounds);
        updates.push("cccd_hash = ?");
        params.push(cccdHash);
      }

      if (updates.length === 0) {
        throw new Error("Không có dữ liệu để cập nhật");
      }

      query += updates.join(", ") + " WHERE ma_nv = ?";
      params.push(ma_nv);

      await pool.execute(query, params);

      return {
        success: true,
        message: "Cập nhật nhân viên thành công",
        data: { ma_nv, ...updateData },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(ma_nv) {
    try {
      // Check if employee has payroll records
      const [payrollCheck] = await pool.execute(
        "SELECT COUNT(*) as count FROM luong_import WHERE ma_nv = ?",
        [ma_nv]
      );

      if (payrollCheck[0].count > 0) {
        throw new Error(
          "Không thể xóa nhân viên đã có dữ liệu lương. Vui lòng xóa dữ liệu lương trước."
        );
      }

      // Delete employee
      const [result] = await pool.execute(
        "DELETE FROM nhan_vien WHERE ma_nv = ?",
        [ma_nv]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Không tìm thấy nhân viên với mã: ${ma_nv}`);
      }

      return {
        success: true,
        message: "Xóa nhân viên thành công",
      };
    } catch (error) {
      throw error;
    }
  }

  async authenticateEmployee(ma_nv, cccd) {
    try {
      const [rows] = await pool.execute(
        "SELECT ma_nv, ho_ten, cccd_hash FROM nhan_vien WHERE ma_nv = ?",
        [ma_nv]
      );

      if (rows.length === 0) {
        throw new Error("Mã nhân viên không tồn tại");
      }

      const employee = rows[0];
      const isValidCCCD = await bcrypt.compare(cccd, employee.cccd_hash);

      if (!isValidCCCD) {
        throw new Error("CCCD không chính xác");
      }

      return {
        success: true,
        data: {
          ma_nv: employee.ma_nv,
          ho_ten: employee.ho_ten,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmployeeService();
