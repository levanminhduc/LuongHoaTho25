const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password, role } = req.body;
      
      console.log(`🔐 Đăng nhập: ${username} - Role: ${role}`);
      
      const result = await authService.login(username, password, role);
      
      res.json(result);
    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error.message);
      res.status(401).json({
        error: 'Đăng nhập thất bại',
        message: error.message
      });
    }
  }

  async logout(req, res, next) {
    try {
      // In a real application, you might want to blacklist the token
      res.json({
        success: true,
        message: 'Đăng xuất thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
