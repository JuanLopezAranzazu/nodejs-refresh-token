const { config } = require("../config/config");

function logErrors(err, req, res, next) {
  console.log("logErrors");
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  console.log("errorHandler");
  res.status(500).json({
    message: err.message,
    stack: config.env === "test" ? err.stack : {},
  });
}

module.exports = { logErrors, errorHandler };
