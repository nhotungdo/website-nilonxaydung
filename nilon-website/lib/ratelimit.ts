/**
 * Rate Limiting Configuration
 * Prevents API abuse and DDoS attacks
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

export const rateLimitConfigs = {
  // Strict limits for order creation
  orders: { interval: 60 * 1000, maxRequests: 5 }, // 5 requests per minute
  
  // Moderate limits for quotes
  quotes: { interval: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  
  // Lenient limits for contact
  contact: { interval: 60 * 1000, maxRequests: 3 }, // 3 requests per minute
  
  // General API limit
  default: { interval: 60 * 1000, maxRequests: 30 }, // 30 requests per minute
};

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.default
): Promise<{ success: boolean; remaining?: number; reset?: number }> {
  const now = Date.now();
  const key = `${identifier}`;

  // Initialize or get existing record
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return { 
      success: true, 
      remaining: config.maxRequests - 1,
      reset: store[key].resetTime 
    };
  }

  // Increment count
  store[key].count++;

  // Check if limit exceeded
  if (store[key].count > config.maxRequests) {
    return { 
      success: false, 
      remaining: 0,
      reset: store[key].resetTime 
    };
  }

  return { 
    success: true, 
    remaining: config.maxRequests - store[key].count,
    reset: store[key].resetTime 
  };
}

export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}
