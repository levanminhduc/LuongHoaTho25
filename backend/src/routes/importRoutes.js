const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middlewares/auth");
const {
  upload,
  importExcel,
  getImportHistory,
  downloadTemplate,
} = require("../controllers/importController");

// All import routes require admin role
router.use(authenticateToken);
router.use(requireRole("admin"));

// POST /api/import/excel - Import Excel file
router.post("/excel", upload.single("file"), importExcel);

// GET /api/import/history - Get import history
router.get("/history", getImportHistory);

// GET /api/import/template - Download Excel template
router.get("/template", downloadTemplate);

module.exports = router;
