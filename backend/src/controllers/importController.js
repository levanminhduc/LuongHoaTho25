const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const { pool } = require("../config/database");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "payroll-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file Excel (.xls, .xlsx)"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Import Excel data
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file Excel để upload",
      });
    }

    const filePath = req.file.path;

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "File Excel không có dữ liệu",
      });
    }

    // Validate and process data
    const processedData = [];
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // Excel row number (starting from 2, assuming row 1 is header)

      // Validate required fields
      if (!row.ma_nv || !row.ho_ten) {
        errors.push(`Dòng ${rowNum}: Thiếu mã nhân viên hoặc họ tên`);
        continue;
      }

      // Check if employee exists
      const [existingEmployee] = await pool.execute(
        "SELECT ma_nv FROM nhan_vien WHERE ma_nv = ?",
        [row.ma_nv]
      );

      if (existingEmployee.length === 0) {
        errors.push(
          `Dòng ${rowNum}: Không tìm thấy nhân viên với mã ${row.ma_nv}`
        );
        continue;
      }

      // Process salary data
      const salaryData = {
        ma_nv: row.ma_nv,
        ho_ten: row.ho_ten,
        luong_cb: parseFloat(row.luong_cb || 0),
        phu_cap: parseFloat(row.phu_cap || 0),
        thue: parseFloat(row.thue || 0),
        thuc_linh: parseFloat(row.thuc_linh || 0),
        ngay_ky: new Date(), // Current date as import date
      };

      // Calculate thuc_linh if not provided
      if (!salaryData.thuc_linh) {
        salaryData.thuc_linh =
          salaryData.luong_cb + salaryData.phu_cap - salaryData.thue;
      }

      processedData.push(salaryData);
    }

    // If there are errors, return them
    if (errors.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Có lỗi trong dữ liệu Excel",
        errors: errors,
      });
    }

    // Insert data into database
    let insertedCount = 0;
    const insertErrors = [];

    for (const data of processedData) {
      try {
        await pool.execute(
          `
          INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, ngay_ky)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          ho_ten = VALUES(ho_ten),
          luong_cb = VALUES(luong_cb),
          phu_cap = VALUES(phu_cap),
          thue = VALUES(thue),
          thuc_linh = VALUES(thuc_linh),
          ngay_ky = VALUES(ngay_ky)
        `,
          [
            data.ma_nv,
            data.ho_ten,
            data.luong_cb,
            data.phu_cap,
            data.thue,
            data.thuc_linh,
            data.ngay_ky,
          ]
        );
        insertedCount++;
      } catch (error) {
        insertErrors.push(`Lỗi insert ${data.ma_nv}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Import thành công ${insertedCount}/${processedData.length} bản ghi`,
      data: {
        totalRows: jsonData.length,
        processedRows: processedData.length,
        insertedRows: insertedCount,
        errors: insertErrors,
      },
    });
  } catch (error) {
    console.error("Import Excel error:", error);

    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi import Excel",
      error: error.message,
    });
  }
};

// Get import history
const getImportHistory = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ma_nv,
        ho_ten,
        luong_cb,
        phu_cap,
        thue,
        thuc_linh,
        da_ky,
        ngay_ky,
        ten_da_ky,
        DATE_FORMAT(ngay_ky, '%Y-%m') as thang_nam
      FROM luong_import 
      ORDER BY ngay_ky DESC, ma_nv ASC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get import history error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử import",
      error: error.message,
    });
  }
};

// Download Excel template
const downloadTemplate = (req, res) => {
  try {
    // Create sample data
    const templateData = [
      {
        ma_nv: "NV001",
        ho_ten: "Nguyễn Văn A",
        luong_cb: 10000000,
        phu_cap: 2000000,
        thue: 1200000,
        thuc_linh: 10800000,
      },
      {
        ma_nv: "NV002",
        ho_ten: "Trần Thị B",
        luong_cb: 12000000,
        phu_cap: 2500000,
        thue: 1450000,
        thuc_linh: 13050000,
      },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Mau_Import_Luong");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mau_import_luong.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Download template error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo file mẫu",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  importExcel,
  getImportHistory,
  downloadTemplate,
};
