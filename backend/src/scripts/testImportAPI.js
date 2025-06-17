const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

async function testImportAPI() {
  try {
    console.log("🧪 Test Import API...");

    // 1. Login để lấy token
    console.log("1️⃣ Đăng nhập admin...");
    const loginResponse = await fetch("http://localhost:4001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
        role: "admin",
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    console.log("✅ Đăng nhập thành công!");
    console.log("🔑 Token:", loginData.token.substring(0, 20) + "...");

    // 2. Test download template
    console.log("\n2️⃣ Test download template...");
    const templateResponse = await fetch(
      "http://localhost:4001/api/import/template",
      {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      }
    );

    console.log("📁 Template response status:", templateResponse.status);
    if (templateResponse.ok) {
      console.log("✅ Download template thành công!");
    }

    // 3. Test import file
    console.log("\n3️⃣ Test import file...");
    const filePath = path.join(
      __dirname,
      "../../uploads/test_import_ready.xlsx"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File không tồn tại: ${filePath}`);
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const importResponse = await fetch(
      "http://localhost:4001/api/import/excel",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.token}`,
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    const importData = await importResponse.json();

    console.log("📊 Import response status:", importResponse.status);
    console.log("📋 Import response:", JSON.stringify(importData, null, 2));

    if (importResponse.ok) {
      console.log("✅ Import thành công!");
    } else {
      console.log("❌ Import thất bại!");
    }
  } catch (error) {
    console.error("💥 Lỗi test:", error.message);
  }
}

testImportAPI();
