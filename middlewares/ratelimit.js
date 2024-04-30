const setRateLimit = require('express-rate-limit');

const rateLimitMiddleware = setRateLimit({
  windowMs: 1000,
  max: 50,
  message: "You have exceeded your 50 requests per second limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;