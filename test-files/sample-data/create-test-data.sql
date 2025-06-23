-- Tạo dữ liệu test cho bảng lương
USE quan_ly_luong;

-- Xóa dữ liệu cũ
DELETE FROM luong_import;

-- Thêm dữ liệu test
INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, da_ky, ngay_ky, ten_da_ky) VALUES
('NV001', 'Nguyễn Văn An', 15000000, 3000000, 1800000, 16200000, 0, NULL, NULL),
('NV002', 'Trần Thị Bình', 12000000, 2500000, 1450000, 13050000, 0, NULL, NULL),
('NV003', 'Lê Văn Cường', 18000000, 3500000, 2150000, 19350000, 1, NOW(), 'Lê Văn Cường'),
('admin', 'Quản trị viên', 20000000, 5000000, 2500000, 22500000, 0, NULL, NULL);

SELECT 'Dữ liệu test đã được tạo thành công!' as message;
SELECT * FROM luong_import;
