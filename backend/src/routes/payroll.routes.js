const express = require("express");
const multer = require("multer");
const path = require("path");
const payrollController = require("../controllers/payrollController");
const { authenticateToken, requireRole } = require("../middlewares/auth");
const {
  validate,
  validateParams,
  validateQuery,
  signPayrollSchema,
  employeeIdSchema,
  paginationSchema,
} = require("../middlewares/validation");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file Excel (.xls, .xlsx)"), false);
    }
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Payroll:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         ma_nv:
 *           type: string
 *         ho_ten:
 *           type: string
 *         luong_cb:
 *           type: number
 *         phu_cap:
 *           type: number
 *         thue:
 *           type: number
 *         thuc_linh:
 *           type: number
 *         da_ky:
 *           type: integer
 *         ngay_ky:
 *           type: string
 *           format: date-time
 *         ten_da_ky:
 *           type: string
 */

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Lấy danh sách bảng lương (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Số bản ghi mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (mã NV hoặc họ tên)
 *     responses:
 *       200:
 *         description: Danh sách bảng lương
 */
router.get(
  "/",
  authenticateToken,
  requireRole(["admin"]),
  validateQuery(paginationSchema),
  payrollController.getAllPayrolls
);

/**
 * @swagger
 * /api/payroll/upload:
 *   post:
 *     summary: Import bảng lương từ file Excel (Admin only)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import thành công
 */
router.post(
  "/upload",
  authenticateToken,
  requireRole(["admin"]),
  upload.single("file"),
  payrollController.importExcel
);

// Alias route for backward compatibility and Frontend consistency
router.post(
  "/import",
  authenticateToken,
  requireRole(["admin"]),
  upload.single("file"),
  payrollController.importExcel
);

/**
 * @swagger
 * /api/payroll/{ma_nv}:
 *   get:
 *     summary: Lấy thông tin lương theo mã nhân viên
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ma_nv
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhân viên
 *     responses:
 *       200:
 *         description: Thông tin lương
 *       404:
 *         description: Không tìm thấy thông tin lương
 */
router.get(
  "/:ma_nv",
  authenticateToken,
  validateParams(employeeIdSchema),
  payrollController.getPayrollByEmployeeId
);

/**
 * @swagger
 * /api/payroll/{ma_nv}/sign:
 *   post:
 *     summary: Ký tên xác nhận lương
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ma_nv
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhân viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_ten:
 *                 type: string
 *                 description: Họ tên người ký
 *     responses:
 *       200:
 *         description: Ký tên thành công
 *       404:
 *         description: Không tìm thấy thông tin lương
 */
router.post(
  "/:ma_nv/sign",
  authenticateToken,
  validateParams(employeeIdSchema),
  validate(signPayrollSchema),
  payrollController.signPayroll
);

// TEMPORARY: Create test data endpoint
router.post(
  "/create-test-data",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { pool } = require("../config/database");

      // Disable foreign key checks temporarily
      await pool.execute("SET FOREIGN_KEY_CHECKS = 0");

      // Clear existing data
      await pool.execute("DELETE FROM luong_import");

      // Create employees first
      const employees = [
        { ma_nv: "NV001", ho_ten: "Nguyễn Văn An", cccd_hash: "hash1" },
        { ma_nv: "NV002", ho_ten: "Trần Thị Bình", cccd_hash: "hash2" },
        { ma_nv: "admin", ho_ten: "Quản trị viên", cccd_hash: "hash3" },
      ];

      for (const emp of employees) {
        await pool.execute(
          "INSERT IGNORE INTO nhan_vien (ma_nv, ho_ten, cccd_hash) VALUES (?, ?, ?)",
          [emp.ma_nv, emp.ho_ten, emp.cccd_hash]
        );
      }

      // Re-enable foreign key checks
      await pool.execute("SET FOREIGN_KEY_CHECKS = 1");

      // Insert test data
      const testData = [
        {
          ma_nv: "NV001",
          ho_ten: "Nguyễn Văn An",
          luong_cb: 15000000,
          phu_cap: 3000000,
          thue: 1800000,
          thuc_linh: 16200000,
        },
        {
          ma_nv: "NV002",
          ho_ten: "Trần Thị Bình",
          luong_cb: 12000000,
          phu_cap: 2500000,
          thue: 1450000,
          thuc_linh: 13050000,
        },
        {
          ma_nv: "admin",
          ho_ten: "Quản trị viên",
          luong_cb: 20000000,
          phu_cap: 5000000,
          thue: 2500000,
          thuc_linh: 22500000,
        },
      ];

      for (const data of testData) {
        await pool.execute(
          "INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) VALUES (?, ?, ?, ?, ?, ?)",
          [
            data.ma_nv,
            data.ho_ten,
            data.luong_cb,
            data.phu_cap,
            data.thue,
            data.thuc_linh,
          ]
        );
      }

      res.json({
        success: true,
        message: "Dữ liệu test đã được tạo thành công",
        data: testData,
      });
    } catch (error) {
      console.error("❌ Error creating test data:", error);
      res.status(500).json({
        error: "Test Data Creation Failed",
        message: error.message,
      });
    }
  }
);

module.exports = router;
