# 🔐 Authentication API Documentation

## Overview

Authentication APIs for user registration, login, and logout using Supabase Auth.

## Endpoints

### 1. Register User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe" // Optional
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error - 400/409/500):**
```json
{
  "error": "Error message here"
}
```

**Validation:**
- Email must be valid format
- Password must be at least 6 characters
- Email must be unique (409 if already exists)

---

### 2. Login

**POST** `/api/auth/login`

Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "jwt-token-here",
    "expires_at": 1234567890
  }
}
```

**Response (Error - 401/500):**
```json
{
  "error": "Invalid email or password"
}
```

**Note:** 
- Sets `sb-access-token` cookie automatically
- Access token should be stored client-side for authenticated requests

---

### 3. Logout

**POST** `/api/auth/logout`

Logout user and clear session.

**Request:** No body required

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** Clears the `sb-access-token` cookie

---

### 4. Get Current User

**GET** `/api/auth/me`

Get information about the currently authenticated user.

**Request Headers:**
```
Authorization: Bearer <access_token>
```

OR

**Cookie:** `sb-access-token=<access_token>`

**Response (Success - 200):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid or expired token"
}
```

---

## Usage Examples

### Register User
```javascript
const register = async () => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe'
    }),
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('Registered:', data.user);
  } else {
    console.error('Error:', data.error);
  }
};
```

### Login
```javascript
const login = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    }),
  });

  const data = await response.json();
  
  if (response.ok) {
    // Store token for future requests
    localStorage.setItem('access_token', data.session.access_token);
    console.log('Logged in:', data.user);
  } else {
    console.error('Error:', data.error);
  }
};
```

### Get Current User
```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('Current user:', data.user);
  } else {
    console.error('Error:', data.error);
  }
};
```

### Logout
```javascript
const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST'
  });

  const data = await response.json();
  
  if (response.ok) {
    localStorage.removeItem('access_token');
    console.log('Logged out');
  }
};
```

---

## Error Codes

- **400**: Bad Request - Missing or invalid input
- **401**: Unauthorized - Invalid credentials or token
- **409**: Conflict - Email already exists
- **500**: Internal Server Error - Server error

---

## Security Notes

1. **Password Requirements**: Minimum 6 characters (can be enhanced)
2. **Tokens**: Access tokens expire based on Supabase session settings
3. **HTTPS**: Always use HTTPS in production
4. **Token Storage**: Store tokens securely (httpOnly cookies preferred)
5. **Validation**: All inputs are validated on the server side

