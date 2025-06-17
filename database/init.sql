-- Create database if not exists
CREATE DATABASE IF NOT EXISTS quan_ly_luong;
USE quan_ly_luong;

-- Create luong_import table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_nv (ma_nv),
  INDEX idx_ho_ten (ho_ten),
  INDEX idx_da_ky (da_ky),
  UNIQUE KEY uniq_ma_nv_thang (ma_nv, YEAR(created_at), MONTH(created_at))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create nhan_vien table for future use
CREATE TABLE IF NOT EXISTS nhan_vien (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ma_nv VARCHAR(20) NOT NULL UNIQUE,
  ho_ten VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  so_dien_thoai VARCHAR(15),
  chuc_vu VARCHAR(50),
  phong_ban VARCHAR(50),
  ngay_vao_lam DATE,
  trang_thai ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ma_nv (ma_nv),
  INDEX idx_ho_ten (ho_ten),
  INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) VALUES
('NV001', 'Nguyễn Văn An', 15000000, 2000000, 1500000, 15500000),
('NV002', 'Trần Thị Bình', 12000000, 1500000, 1200000, 12300000),
('NV003', 'Lê Văn Cường', 18000000, 2500000, 2000000, 18500000),
('NV004', 'Phạm Thị Dung', 14000000, 1800000, 1400000, 14400000),
('NV005', 'Hoàng Văn Em', 16000000, 2200000, 1600000, 16600000)
ON DUPLICATE KEY UPDATE
ho_ten = VALUES(ho_ten),
luong_cb = VALUES(luong_cb),
phu_cap = VALUES(phu_cap),
thue = VALUES(thue),
thuc_linh = VALUES(thuc_linh);

-- Insert sample employee data
INSERT INTO nhan_vien (ma_nv, ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, ngay_vao_lam) VALUES
('NV001', 'Nguyễn Văn An', 'an.nguyen@company.com', '0901234567', 'Nhân viên', 'Kế toán', '2023-01-15'),
('NV002', 'Trần Thị Bình', 'binh.tran@company.com', '0901234568', 'Nhân viên', 'Nhân sự', '2023-02-20'),
('NV003', 'Lê Văn Cường', 'cuong.le@company.com', '0901234569', 'Trưởng phòng', 'Kỹ thuật', '2022-12-01'),
('NV004', 'Phạm Thị Dung', 'dung.pham@company.com', '0901234570', 'Nhân viên', 'Marketing', '2023-03-10'),
('NV005', 'Hoàng Văn Em', 'em.hoang@company.com', '0901234571', 'Nhân viên', 'Kỹ thuật', '2023-01-25')
ON DUPLICATE KEY UPDATE
ho_ten = VALUES(ho_ten),
email = VALUES(email),
so_dien_thoai = VALUES(so_dien_thoai),
chuc_vu = VALUES(chuc_vu),
phong_ban = VALUES(phong_ban),
ngay_vao_lam = VALUES(ngay_vao_lam);
