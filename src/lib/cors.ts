export function corsHeaders(origin?: string | null) {
  const allowedOrigins = [
    'https://roots-front-one.vercel.app',
    'http://localhost:5173', // Vite default port
    'http://localhost:3000',
  ]

  const originHeader = origin && allowedOrigins.includes(origin)
    ? origin
    : 'https://roots-front-one.vercel.app'

  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

