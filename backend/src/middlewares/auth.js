const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

// Cache for decoded tokens to avoid repeated verification
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
      message: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  // Check cache first for performance
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    req.user = cached.user;
    return next();
  }

  jwt.verify(token, authConfig.jwtSecret, (err, user) => {
    if (err) {
      // Remove from cache if invalid
      tokenCache.delete(token);
      return res.status(403).json({
        error: "Invalid token",
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // Cache valid token
    tokenCache.set(token, {
      user,
      timestamp: Date.now(),
    });

    // Clean old cache entries periodically
    if (tokenCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          tokenCache.delete(key);
        }
      }
    }

    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        message: "Bạn không có quyền truy cập tính năng này",
      });
    }

    next();
  };
};

// Performance optimized version that skips auth for public routes
const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  // Use cache for optional auth too
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    req.user = cached.user;
    return next();
  }

  jwt.verify(token, authConfig.jwtSecret, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
      tokenCache.set(token, {
        user,
        timestamp: Date.now(),
      });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateOptional,
  requireRole,
};
