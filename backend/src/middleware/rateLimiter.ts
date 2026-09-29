import rateLimit from 'express-rate-limit';

// General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
    },
  },
});

// Form Submission Rate Limiter (Quote RFQs, Dealer Applications, Careers)
export const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // Limit form submissions to 25 per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'ENQUIRY_LIMIT_EXCEEDED',
      message: 'Submission quota exceeded from this IP. Please try again later or contact our corporate office.',
    },
  },
});

// Admin Login Brute Force Protection Limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Too many login attempts. Account access temporarily locked for 15 minutes.',
    },
  },
});
