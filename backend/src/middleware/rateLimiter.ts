import rateLimit from "express-rate-limit";

/**
 * Rate Limiters
 * * Protects the API from DoS attacks, brute-force attempts, and abuse.
 * * Configured for Render's environment (behind a proxy).
 */

// Custom handler to ensure consistent JSON error format
const limitHandler = (message: string) => {
  return (req: any, res: any) => {
    res.status(429).json({
      status: "error",
      code: "RATE_LIMIT_EXCEEDED",
      message: message,
      requestId: req.requestId, // Injected by requestLogger
    });
  };
};

/**
 * Global Limiter
 * Applied to all API routes to prevent general flooding.
 * Limit: 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: limitHandler(
    "Too many requests from this IP, please try again after 15 minutes."
  ),
  // Render puts the app behind a load balancer, so we rely on Express 'trust proxy' setting
  // or the X-Forwarded-For header being parsed correctly by the app.
  validate: { trustProxy: false }, // We handle trust proxy in app.ts
});

/**
 * Auth Limiter
 * Applied to sensitive auth routes (Login/Register/Verify) to prevent brute-force.
 * Limit: 5 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(
    "Too many login attempts. Please try again after 15 minutes."
  ),
  validate: { trustProxy: false },
});

/**
 * AI Limiter
 * Applied to Gemini/AI endpoints to manage Free Tier quotas and costs.
 * Limit: 20 requests per hour (conservative for Free Tier).
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(
    "You have reached the hourly AI usage limit. Please try again later."
  ),
  validate: { trustProxy: false },
});
