const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // MySQL errors
  if (err.code) {
    switch (err.code) {
      case 'ER_NO_SUCH_TABLE':
        error = {
          statusCode: 500,
          message: 'Bảng database không tồn tại'
        };
        break;
      case 'ER_ACCESS_DENIED_ERROR':
        error = {
          statusCode: 500,
          message: 'Lỗi quyền truy cập database'
        };
        break;
      case 'ER_DUP_ENTRY':
        error = {
          statusCode: 409,
          message: 'Dữ liệu đã tồn tại'
        };
        break;
      case 'ECONNREFUSED':
        error = {
          statusCode: 500,
          message: 'Không thể kết nối database'
        };
        break;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Token không hợp lệ'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token đã hết hạn'
    };
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      statusCode: 400,
      message: 'File quá lớn. Kích thước tối đa là 10MB'
    };
  }

  res.status(error.statusCode).json({
    error: true,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
