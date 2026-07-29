/**
 * API Authentication and Authorization
 * Protects API endpoints from unauthorized access
 */

export function validateApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  const apiSecret = process.env.API_SECRET_KEY;

  if (!apiSecret) {
    console.error('API_SECRET_KEY not configured');
    return false;
  }

  // Allow requests without API key if secret is not enforced
  if (process.env.REQUIRE_API_AUTH !== 'true') {
    return true;
  }

  return apiKey === apiSecret;
}

export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

  // If no origins configured, allow all (backward compatibility)
  if (allowedOrigins.length === 0) {
    return true;
  }

  // Allow same-origin requests
  if (!origin) {
    return true;
  }

  return allowedOrigins.some(allowed => 
    origin === allowed || origin.endsWith(allowed)
  );
}

export function createAuthError(message: string, status: number = 401) {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message 
    }), 
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
