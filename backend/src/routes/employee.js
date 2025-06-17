const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const employeeValidation = require("../validations/employeeValidation");

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - ma_nv
 *         - ho_ten
 *         - cccd
 *       properties:
 *         id:
 *           type: integer
 *           description: ID tự động tăng
 *         ma_nv:
 *           type: string
 *           description: Mã nhân viên
 *           example: "NV001"
 *         ho_ten:
 *           type: string
 *           description: Họ và tên nhân viên
 *           example: "Nguyễn Văn An"
 *         cccd:
 *           type: string
 *           description: Số CCCD (chỉ dùng khi tạo/cập nhật)
 *           example: "123456789012"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Lấy danh sách nhân viên (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (mã NV hoặc họ tên)
 *     responses:
 *       200:
 *         description: Danh sách nhân viên
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền truy cập
 */
router.get(
  "/",
  auth.authenticateToken,
  auth.requireRole(["admin"]),
  validation.validate(employeeValidation.getAllEmployees),
  employeeController.getAllEmployees
);

/**
 * @swagger
 * /api/employees/{ma_nv}:
 *   get:
 *     summary: Lấy thông tin nhân viên theo mã (Admin hoặc chính nhân viên đó)
 *     tags: [Employees]
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
 *         description: Thông tin nhân viên
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhân viên
 */
router.get(
  "/:ma_nv",
  auth.authenticateToken,
  auth.requireRole(["admin", "employee"]),
  validation.validate(employeeValidation.getEmployeeById),
  employeeController.getEmployeeById
);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Tạo nhân viên mới (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_nv
 *               - ho_ten
 *               - cccd
 *             properties:
 *               ma_nv:
 *                 type: string
 *                 example: "NV011"
 *               ho_ten:
 *                 type: string
 *                 example: "Nguyễn Văn Bình"
 *               cccd:
 *                 type: string
 *                 example: "123456789022"
 *     responses:
 *       201:
 *         description: Tạo nhân viên thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post(
  "/",
  auth.authenticateToken,
  auth.requireRole(["admin"]),
  validation.validate(employeeValidation.createEmployee),
  employeeController.createEmployee
);

/**
 * @swagger
 * /api/employees/{ma_nv}:
 *   put:
 *     summary: Cập nhật thông tin nhân viên (Admin only)
 *     tags: [Employees]
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
 *                 example: "Nguyễn Văn Cường"
 *               cccd:
 *                 type: string
 *                 example: "123456789023"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy nhân viên
 */
router.put(
  "/:ma_nv",
  auth.authenticateToken,
  auth.requireRole(["admin"]),
  validation.validate(employeeValidation.updateEmployee),
  employeeController.updateEmployee
);

/**
 * @swagger
 * /api/employees/{ma_nv}:
 *   delete:
 *     summary: Xóa nhân viên (Admin only)
 *     tags: [Employees]
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
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa (có dữ liệu lương)
 *       404:
 *         description: Không tìm thấy nhân viên
 */
router.delete(
  "/:ma_nv",
  auth.authenticateToken,
  auth.requireRole(["admin"]),
  validation.validate(employeeValidation.deleteEmployee),
  employeeController.deleteEmployee
);

module.exports = router;
