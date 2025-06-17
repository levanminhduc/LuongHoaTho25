const { pool } = require("../config/database");
const XLSX = require("xlsx");
const fs = require("fs");

class PayrollService {
  async getAllPayrolls(page = 1, limit = 10, keyword = "") {
    try {
      // Ensure page and limit are integers
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      console.log(
        `🔍 Debug SQL params - Page: ${pageNum}, Limit: ${limitNum}, Offset: ${offset}, Keyword: "${keyword}"`
      );

      let query = "SELECT * FROM luong_import";
      let countQuery = "SELECT COUNT(*) as total FROM luong_import";
      const params = [];
      const countParams = [];

      if (keyword && keyword.trim()) {
        query += " WHERE ma_nv LIKE ? OR ho_ten LIKE ?";
        countQuery += " WHERE ma_nv LIKE ? OR ho_ten LIKE ?";
        const searchTerm = `%${keyword.trim()}%`;
        params.push(searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm);
      }

      // Use string interpolation for LIMIT and OFFSET to avoid MySQL2 issues
      query += ` ORDER BY id DESC LIMIT ${limitNum} OFFSET ${offset}`;

      console.log(`🔍 Final query: ${query}`);
      console.log(`🔍 Query params:`, params);
      console.log(`🔍 Count query: ${countQuery}`);
      console.log(`🔍 Count params:`, countParams);

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

  async getPayrollByEmployeeId(ma_nv) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM luong_import WHERE ma_nv = ?",
        [ma_nv]
      );

      if (rows.length === 0) {
        throw new Error(
          `Không tìm thấy thông tin lương cho mã nhân viên: ${ma_nv}`
        );
      }

      return {
        success: true,
        data: rows[0],
      };
    } catch (error) {
      throw error;
    }
  }

  async signPayroll(ma_nv, ho_ten) {
    try {
      const [result] = await pool.execute(
        "UPDATE luong_import SET da_ky = 1, ngay_ky = NOW(), ten_da_ky = ? WHERE ma_nv = ?",
        [ho_ten, ma_nv]
      );

      if (result.affectedRows === 0) {
        throw new Error(
          `Không tìm thấy thông tin lương cho mã nhân viên: ${ma_nv}`
        );
      }

      return {
        success: true,
        message: "Ký tên xác nhận thành công",
        data: {
          ma_nv,
          ho_ten,
          ngay_ky: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async importFromExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const row of data) {
        try {
          const { ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh } = row;

          if (!ma_nv || !ho_ten) {
            errors.push(`Dòng thiếu thông tin: ${JSON.stringify(row)}`);
            errorCount++;
            continue;
          }

          await pool.execute(
            `INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) 
             VALUES (?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             ho_ten = VALUES(ho_ten),
             luong_cb = VALUES(luong_cb),
             phu_cap = VALUES(phu_cap),
             thue = VALUES(thue),
             thuc_linh = VALUES(thuc_linh)`,
            [
              ma_nv,
              ho_ten,
              luong_cb || 0,
              phu_cap || 0,
              thue || 0,
              thuc_linh || 0,
            ]
          );

          successCount++;
        } catch (error) {
          // Check for foreign key constraint error
          if (error.errno === 1452) {
            errors.push(
              `Mã nhân viên ${row.ma_nv} chưa tồn tại trong danh sách nhân sự`
            );
          } else {
            errors.push(
              `Lỗi xử lý dòng ${JSON.stringify(row)}: ${error.message}`
            );
          }
          errorCount++;
        }
      }

      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Check if there are foreign key errors
      const hasForeignKeyErrors = errors.some((error) =>
        error.includes("chưa tồn tại trong danh sách nhân sự")
      );

      return {
        success: errorCount === 0,
        message: hasForeignKeyErrors
          ? "Có mã nhân viên chưa khởi tạo trong danh sách nhân sự – hãy bổ sung bảng nhân viên trước."
          : "Import file Excel hoàn tất",
        data: {
          totalRows: data.length,
          successCount,
          errorCount,
          errors: errors.slice(0, 10), // Only return first 10 errors
          hasForeignKeyErrors,
        },
      };
    } catch (error) {
      // Clean up uploaded file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }
}

module.exports = new PayrollService();
