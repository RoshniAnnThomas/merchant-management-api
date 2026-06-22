const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server error';
  let errors;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((error) => error.message);
  }

  if (err.code === 11000) {
    statusCode = 409;

    if (err.keyPattern && err.keyPattern.registrationNumber) {
      message = 'Merchant registration number already exists';
    } else {
      const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
      message = `${duplicateField} already exists`;
    }
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

module.exports = errorHandler;
