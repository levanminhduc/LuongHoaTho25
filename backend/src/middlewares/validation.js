const Joi = require("joi");

const validate = (schemas) => {
  return (req, res, next) => {
    // If schemas is a Joi schema object, validate body directly
    if (schemas.validate && typeof schemas.validate === "function") {
      const { error } = schemas.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
          details: error.details,
        });
      }
      return next();
    }

    // If schemas is an object with body, params, query schemas
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
          details: error.details,
        });
      }
    }

    if (schemas.params) {
      const { error } = schemas.params.validate(req.params);
      if (error) {
        return res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
          details: error.details,
        });
      }
    }

    if (schemas.query) {
      const { error } = schemas.query.validate(req.query);
      if (error) {
        return res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
          details: error.details,
        });
      }
    }

    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        message: error.details[0].message,
        details: error.details,
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        message: error.details[0].message,
        details: error.details,
      });
    }
    next();
  };
};

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Tên đăng nhập không được để trống",
    "any.required": "Tên đăng nhập là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  role: Joi.string().valid("admin", "employee").required().messages({
    "any.only": "Role phải là admin hoặc employee",
    "any.required": "Role là bắt buộc",
  }),
});

const signPayrollSchema = Joi.object({
  ho_ten: Joi.string().required().messages({
    "string.empty": "Họ tên không được để trống",
    "any.required": "Họ tên là bắt buộc",
  }),
});

const employeeIdSchema = Joi.object({
  ma_nv: Joi.string().required().messages({
    "string.empty": "Mã nhân viên không được để trống",
    "any.required": "Mã nhân viên là bắt buộc",
  }),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  keyword: Joi.string().allow("").optional(),
});

module.exports = {
  validate,
  validateParams,
  validateQuery,
  loginSchema,
  signPayrollSchema,
  employeeIdSchema,
  paginationSchema,
};
