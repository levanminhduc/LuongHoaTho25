-- Fix database with test data immediately
USE quan_ly_luong;

-- Ensure table exists with correct structure
CREATE TABLE IF NOT EXISTS luong_import (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ma_nv VARCHAR(20) NOT NULL,
  ho_ten VARCHAR(100),
  luong_cb DECIMAL(15,2) DEFAULT 0,
  phu_cap DECIMAL(15,2) DEFAULT 0,
  thue DECIMAL(15,2) DEFAULT 0,
  thuc_linh DECIMAL(15,2) DEFAULT 0,
  da_ky TINYINT DEFAULT 0,
  ngay_ky DATETIME,
  ten_da_ky VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clear existing data
DELETE FROM luong_import;

-- Add test data with da_ky column
INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, da_ky, ngay_ky, ten_da_ky) VALUES
('admin', 'Quản trị viên', 20000000.00, 5000000.00, 2500000.00, 22500000.00, 1, NOW(), 'Quản trị viên'),
('NV001', 'Nguyễn Văn An', 15000000.00, 3000000.00, 1800000.00, 16200000.00, 0, NULL, NULL),
('NV002', 'Trần Thị Bình', 12000000.00, 2500000.00, 1450000.00, 13050000.00, 0, NULL, NULL),
('NV003', 'Lê Văn Cường', 18000000.00, 3500000.00, 2150000.00, 19350000.00, 1, '2025-06-15 10:30:00', 'Lê Văn Cường');

-- Verify data
SELECT 'Test data added successfully!' as message;
SELECT COUNT(*) as total_records FROM luong_import;
SELECT * FROM luong_import;

-- Check table structure
DESCRIBE luong_import;
