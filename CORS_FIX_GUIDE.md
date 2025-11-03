# CORS Fix Guide for Next.js Backend

## Problem
Your frontend (`roots-front-one.vercel.app`) is making requests to your backend (`roots-back-td3h.vercel.app`), but CORS errors are blocking the requests.

## Solution

Add CORS headers to your Next.js backend API routes. Here are the files you need to add/modify in your **backend repository**:

### Option 1: Create a CORS Helper (Recommended)

**1. Create `lib/cors.js` (or `utils/cors.js`):**

```javascript
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://roots-front-one.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
```

**2. Update your API routes:**

**For Pages Router (`pages/api/upload.js`):**
```javascript
import { corsHeaders, handleCors } from '@/lib/cors';

export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (handleCors(req, res)) return;

  // Set CORS headers
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'POST') {
    // Your existing upload logic
    // ...
    res.status(200).json({ success: true, message: 'Upload successful' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

**For App Router (`app/api/upload/route.js`):**
```javascript
import { NextResponse } from 'next/server';
import { corsHeaders } from '@/lib/cors';

export async function POST(request) {
  const formData = await request.formData();
  // Your existing upload logic
  // ...
  
  return NextResponse.json(
    { success: true, message: 'Upload successful' },
    { headers: corsHeaders() }
  );
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
```

### Option 2: Use Next.js Config (Alternative)

Add to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://roots-front-one.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### APIs That Need CORS Fix

Based on your frontend code, update these API routes:
- `/api/upload` (POST)
- `/api/contact` (POST)
- `/api/admin/approve` (GET, PATCH)
- `/api/editorial-board` (GET, POST)
- `/api/editorial-board/upload` (POST)
- `/api/articles` (GET)
- `/api/auth/login` (POST)

### For Development (Allow Localhost)

If you also want to allow localhost during development, modify `corsHeaders()`:

```javascript
const allowedOrigins = [
  'https://roots-front-one.vercel.app',
  'http://localhost:5173', // Vite default port
  'http://localhost:3000',
];

export function corsHeaders(origin) {
  const originHeader = allowedOrigins.includes(origin) 
    ? origin 
    : 'https://roots-front-one.vercel.app';
    
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}
```

## After Making Changes

1. Commit and push to your backend repository
2. Vercel will automatically redeploy
3. Test your frontend - CORS errors should be resolved!

## Testing

After deployment, test in browser DevTools:
- Network tab should show `200 OK` instead of `CORS error`
- Response headers should include `Access-Control-Allow-Origin`

