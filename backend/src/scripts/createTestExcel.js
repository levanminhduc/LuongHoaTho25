const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Tạo dữ liệu test
const testData = [
  {
    ma_nv: 'NV006',
    ho_ten: 'Vũ Thị Hoa',
    luong_cb: 13000000,
    phu_cap: 2600000,
    thue: 1560000,
    thuc_linh: 14040000
  },
  {
    ma_nv: 'NV007',
    ho_ten: 'Đỗ Văn Giang',
    luong_cb: 17000000,
    phu_cap: 3400000,
    thue: 2040000,
    thuc_linh: 18360000
  },
  {
    ma_nv: 'NV008',
    ho_ten: 'Bùi Thị Lan',
    luong_cb: 11000000,
    phu_cap: 2200000,
    thue: 1320000,
    thuc_linh: 11880000
  },
  {
    ma_nv: 'NV009',
    ho_ten: 'Ngô Văn Minh',
    luong_cb: 19000000,
    phu_cap: 3800000,
    thue: 2280000,
    thuc_linh: 20520000
  },
  {
    ma_nv: 'NV010',
    ho_ten: 'Lý Thị Nga',
    luong_cb: 14500000,
    phu_cap: 2900000,
    thue: 1740000,
    thuc_linh: 15660000
  }
];

try {
  console.log('📊 Tạo file Excel test...');
  
  // Tạo workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(testData);
  
  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Luong_Test');
  
  // Tạo thư mục uploads nếu chưa có
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Lưu file
  const filePath = path.join(uploadsDir, 'test_import_luong.xlsx');
  XLSX.writeFile(wb, filePath);
  
  console.log('✅ Đã tạo file Excel test:', filePath);
  console.log('📋 Dữ liệu test:');
  testData.forEach(item => {
    console.log(`   ${item.ma_nv} - ${item.ho_ten}: ${item.thuc_linh.toLocaleString('vi-VN')} VND`);
  });
  
} catch (error) {
  console.error('❌ Lỗi tạo file Excel:', error);
}
