const Joi = require('joi');

const employeeValidation = {
  // Validation for getting all employees
  getAllEmployees: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      keyword: Joi.string().max(255).allow('').default('')
    })
  },

  // Validation for getting employee by ID
  getEmployeeById: {
    params: Joi.object({
      ma_nv: Joi.string().required().messages({
        'any.required': 'Mã nhân viên là bắt buộc',
        'string.empty': 'Mã nhân viên không được để trống'
      })
    })
  },

  // Validation for creating employee
  createEmployee: {
    body: Joi.object({
      ma_nv: Joi.string().max(20).required().messages({
        'any.required': 'Mã nhân viên là bắt buộc',
        'string.empty': 'Mã nhân viên không được để trống',
        'string.max': 'Mã nhân viên tối đa 20 ký tự'
      }),
      ho_ten: Joi.string().max(255).required().messages({
        'any.required': 'Họ tên là bắt buộc',
        'string.empty': 'Họ tên không được để trống',
        'string.max': 'Họ tên tối đa 255 ký tự'
      }),
      cccd: Joi.string().length(12).pattern(/^\d+$/).required().messages({
        'any.required': 'CCCD là bắt buộc',
        'string.empty': 'CCCD không được để trống',
        'string.length': 'CCCD phải có đúng 12 số',
        'string.pattern.base': 'CCCD chỉ được chứa số'
      })
    })
  },

  // Validation for updating employee
  updateEmployee: {
    params: Joi.object({
      ma_nv: Joi.string().required().messages({
        'any.required': 'Mã nhân viên là bắt buộc',
        'string.empty': 'Mã nhân viên không được để trống'
      })
    }),
    body: Joi.object({
      ho_ten: Joi.string().max(255).optional().messages({
        'string.max': 'Họ tên tối đa 255 ký tự'
      }),
      cccd: Joi.string().length(12).pattern(/^\d+$/).optional().messages({
        'string.length': 'CCCD phải có đúng 12 số',
        'string.pattern.base': 'CCCD chỉ được chứa số'
      })
    }).min(1).messages({
      'object.min': 'Cần ít nhất một trường để cập nhật'
    })
  },

  // Validation for deleting employee
  deleteEmployee: {
    params: Joi.object({
      ma_nv: Joi.string().required().messages({
        'any.required': 'Mã nhân viên là bắt buộc',
        'string.empty': 'Mã nhân viên không được để trống'
      })
    })
  }
};

module.exports = employeeValidation;
