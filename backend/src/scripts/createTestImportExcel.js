const XLSX = require("xlsx");
const path = require("path");

async function createTestImportExcel() {
  try {
    console.log("📊 Tạo file Excel test import...");

    // Dữ liệu test khớp với nhân viên có sẵn
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
        phu_cap: 2000000,
        thue: 1400000,
        thuc_linh: 12600000,
      },
      {
        ma_nv: "NV003",
        ho_ten: "Lê Văn Cường",
        luong_cb: 18000000,
        phu_cap: 4000000,
        thue: 2200000,
        thuc_linh: 19800000,
      },
    ];

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(testData);

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Luong_Import");

    // Lưu file
    const filePath = path.join(
      __dirname,
      "../../uploads/test_import_ready.xlsx"
    );
    XLSX.writeFile(wb, filePath);

    console.log("✅ File Excel test đã được tạo:");
    console.log(`   📍 Đường dẫn: ${filePath}`);
    console.log("📋 Dữ liệu test:");
    testData.forEach((item) => {
      console.log(
        `   - ${item.ma_nv}: ${item.ho_ten} - ${item.thuc_linh.toLocaleString()} VND`
      );
    });

    console.log("✨ Hoàn thành!");
  } catch (error) {
    console.error("❌ Lỗi tạo file Excel:", error.message);
    throw error;
  }
}

createTestImportExcel()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log("💥 Lỗi:", error);
    process.exit(1);
  });
