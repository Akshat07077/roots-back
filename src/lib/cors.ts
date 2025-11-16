export function corsHeaders(origin?: string | null) {
  const allowedOrigins = [
    'https://roots-front-one.vercel.app',
    'http://localhost:5173', // Vite default port
    'http://localhost:3000',
  ]

  // If origin is provided and in allowed list, use it
  // If origin is null/undefined (same-origin), we can be more permissive
  // Otherwise, default to production frontend
  let originHeader: string
  if (origin && allowedOrigins.includes(origin)) {
    originHeader = origin
  } else if (!origin) {
    // Same-origin request or no origin header - allow all for simplicity
    // In production, same-origin requests don't need CORS, but this is safe
    originHeader = '*'
  } else {
    // Unknown origin - default to production frontend
    originHeader = 'https://roots-front-one.vercel.app'
  }

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Only add credentials header if using specific origin (not wildcard)
  // Wildcard (*) cannot be used with credentials
  if (originHeader !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return headers
}

