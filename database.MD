CREATE TABLE luong_import (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ma_nv VARCHAR(20) NOT NULL,
  ho_ten VARCHAR(100),
  luong_cb DECIMAL(15,2),
  phu_cap DECIMAL(15,2),
  thue DECIMAL(15,2),
  thuc_linh DECIMAL(15,2),
  da_ky TINYINT DEFAULT 0,
  ngay_ky DATETIME,
  ten_da_ky VARCHAR(100),
  UNIQUE KEY uniq_ma_nv_thang (ma_nv, YEAR(ngay_ky), MONTH(ngay_ky))
) ENGINE=InnoDB;
