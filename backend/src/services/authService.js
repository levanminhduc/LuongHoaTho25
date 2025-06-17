const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");
const authConfig = require("../config/auth");
const employeeService = require("./employeeService");

class AuthService {
  async login(username, password, role) {
    try {
      if (role === "admin") {
        return await this.loginAdmin(username, password);
      } else if (role === "employee") {
        return await this.loginEmployee(username, password);
      } else {
        throw new Error("Role không hợp lệ");
      }
    } catch (error) {
      throw error;
    }
  }

  async loginAdmin(username, password) {
    // Simple admin login - in production, store admin credentials in database
    if (username === "admin" && password === "admin123") {
      const token = this.generateToken({
        username: "admin",
        role: "admin",
        fullName: "Quản trị viên",
      });

      return {
        success: true,
        message: "Đăng nhập Admin thành công",
        token,
        user: {
          username: "admin",
          role: "admin",
          fullName: "Quản trị viên",
        },
      };
    } else {
      throw new Error("Thông tin đăng nhập Admin không chính xác");
    }
  }

  async loginEmployee(username, password) {
    try {
      // Authenticate using CCCD via employeeService
      const authResult = await employeeService.authenticateEmployee(
        username,
        password
      );

      if (!authResult.success) {
        throw new Error("Thông tin đăng nhập không chính xác");
      }

      const employee = authResult.data;

      const token = this.generateToken({
        username: employee.ma_nv,
        role: "employee",
        fullName: employee.ho_ten,
      });

      return {
        success: true,
        message: "Đăng nhập Nhân viên thành công",
        token,
        user: {
          username: employee.ma_nv,
          role: "employee",
          fullName: employee.ho_ten,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  generateToken(payload) {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
    });
  }

  verifyToken(token) {
    return jwt.verify(token, authConfig.jwtSecret);
  }
}

module.exports = new AuthService();
