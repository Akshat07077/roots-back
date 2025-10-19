# 📚 Academic Archive API Documentation

## 🚀 Base URL
```
http://localhost:3000/api
```

## 📋 Overview

This API handles academic paper submissions with user tracking, file uploads, and admin approval workflow.

### Key Features
- ✅ User registration and tracking
- ✅ File upload (DOCX + payment screenshots)
- ✅ Admin approval system
- ✅ User submission history
- ✅ Contact information management

---

## 🔐 Authentication
All endpoints use Supabase service role authentication. No user authentication required for API calls.

---

## 📤 API Endpoints

### 1. Upload Paper
**POST** `/api/upload`

Upload a new academic paper with user information.

#### Request Body (FormData)
```javascript
const formData = new FormData();
formData.append('title', 'Paper Title');
formData.append('authorName', 'Author Name');
formData.append('email', 'author@example.com');
formData.append('mobileNumber', '+1234567890');
formData.append('file', docxFile); // File object
formData.append('paymentScreenshot', imageFile); // Optional File object
```

#### Required Fields
- `title` (string): Paper title
- `authorName` (string): Author's name
- `email` (string): Author's email address
- `mobileNumber` (string): Author's mobile number
- `file` (File): DOCX file (only .docx allowed)

#### Optional Fields
- `paymentScreenshot` (File): PNG/JPG image (optional)

#### Response
```json
{
  "success": true,
  "article": {
    "id": "uuid-here",
    "title": "Paper Title",
    "author_name": "Author Name",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Response
```json
{
  "error": "Error message here"
}
```

#### Example Usage
```javascript
const uploadPaper = async (formData) => {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Upload successful:', data.article);
  } else {
    console.error('Upload failed:', data.error);
  }
};
```

---

### 2. Get Approved Articles
**GET** `/api/articles`

Retrieve all approved articles for public display.

#### Response
```json
{
  "articles": [
    {
      "id": "uuid-here",
      "title": "Paper Title",
      "author_name": "Author Name",
      "docx_url": "https://storage-url/docx-file",
      "payment_screenshot_url": "https://storage-url/payment-image",
      "status": "approved",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Example Usage
```javascript
const getApprovedArticles = async () => {
  const response = await fetch('/api/articles');
  const data = await response.json();
  
  if (response.ok) {
    return data.articles;
  } else {
    console.error('Failed to fetch articles:', data.error);
    return [];
  }
};
```

---

### 3. Get All Articles (Admin)
**GET** `/api/admin/approve`

Retrieve all articles for admin review (pending, approved, rejected).

#### Response
```json
{
  "articles": [
    {
      "id": "uuid-here",
      "user_id": "user-uuid-here",
      "title": "Paper Title",
      "author_name": "Author Name",
      "docx_url": "https://storage-url/docx-file",
      "payment_screenshot_url": "https://storage-url/payment-image",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Example Usage
```javascript
const getAllArticles = async () => {
  const response = await fetch('/api/admin/approve');
  const data = await response.json();
  
  if (response.ok) {
    return data.articles;
  } else {
    console.error('Failed to fetch articles:', data.error);
    return [];
  }
};
```

---

### 4. Update Article Status (Admin)
**PATCH** `/api/admin/approve`

Approve or reject an article.

#### Request Body
```json
{
  "id": "article-uuid-here",
  "status": "approved" // or "rejected"
}
```

#### Response
```json
{
  "success": true,
  "article": {
    "id": "uuid-here",
    "title": "Paper Title",
    "author_name": "Author Name",
    "status": "approved",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Example Usage
```javascript
const updateArticleStatus = async (articleId, status) => {
  const response = await fetch('/api/admin/approve', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: articleId,
      status: status // 'approved' or 'rejected'
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Status updated:', data.article);
  } else {
    console.error('Update failed:', data.error);
  }
};
```

---

### 5. Get User Submissions
**GET** `/api/user-submissions?email=user@example.com`

Get all submissions by a specific user.

#### Query Parameters
- `email` (string, required): User's email address

#### Response
```json
{
  "user": {
    "id": "user-uuid-here",
    "email": "user@example.com",
    "mobile_number": "+1234567890",
    "author_name": "Author Name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "articles": [
      {
        "id": "article-uuid-here",
        "title": "Paper Title",
        "docx_url": "https://storage-url/docx-file",
        "payment_screenshot_url": "https://storage-url/payment-image",
        "status": "pending",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Example Usage
```javascript
const getUserSubmissions = async (email) => {
  const response = await fetch(`/api/user-submissions?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  
  if (response.ok) {
    return data.user;
  } else {
    console.error('Failed to fetch user:', data.error);
    return null;
  }
};
```

---

## 📊 Data Models

### User Object
```typescript
interface User {
  id: string;
  email: string;
  mobile_number: string;
  author_name: string;
  created_at: string;
}
```

### Article Object
```typescript
interface Article {
  id: string;
  user_id?: string;
  title: string;
  author_name: string;
  docx_url: string;
  payment_screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}
```

### User with Articles
```typescript
interface UserWithArticles extends User {
  articles: Article[];
}
```

---

## 🎯 Common Use Cases

### 1. Submit a Paper
```javascript
const submitPaper = async (paperData) => {
  const formData = new FormData();
  formData.append('title', paperData.title);
  formData.append('authorName', paperData.authorName);
  formData.append('email', paperData.email);
  formData.append('mobileNumber', paperData.mobileNumber);
  formData.append('file', paperData.file);
  
  if (paperData.paymentScreenshot) {
    formData.append('paymentScreenshot', paperData.paymentScreenshot);
  }
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### 2. Admin Dashboard
```javascript
const getAdminData = async () => {
  const [articlesResponse, usersResponse] = await Promise.all([
    fetch('/api/admin/approve'),
    fetch('/api/user-submissions?email=admin@example.com')
  ]);
  
  const articles = await articlesResponse.json();
  const users = await usersResponse.json();
  
  return { articles: articles.articles, users: users.user };
};
```

### 3. Public Archive
```javascript
const getPublicArchive = async () => {
  const response = await fetch('/api/articles');
  const data = await response.json();
  
  return data.articles; // Only approved articles
};
```

---

## 🚨 Error Handling

### Common Error Responses
```json
{
  "error": "File, title, author name, email, and mobile number are required"
}
```

```json
{
  "error": "Only DOCX files are allowed"
}
```

```json
{
  "error": "Payment screenshot must be PNG or JPG"
}
```

```json
{
  "error": "User not found"
}
```

### Error Handling Example
```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'API call failed');
    }
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};
```

---

## 🔧 File Upload Requirements

### DOCX Files
- **Format**: .docx only
- **Size**: Limited by server configuration
- **Storage**: Supabase Storage (private bucket)

### Payment Screenshots
- **Formats**: PNG, JPG, JPEG only
- **Size**: Limited by server configuration
- **Storage**: Supabase Storage (private bucket)

---

## 📱 Frontend Integration Examples

### React Hook Example
```javascript
const useAcademicArchive = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const submitPaper = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data.article;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { submitPaper, loading, error };
};
```

### Vue.js Composition API Example
```javascript
import { ref } from 'vue';

export const useAcademicArchive = () => {
  const loading = ref(false);
  const error = ref(null);
  
  const submitPaper = async (formData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data.article;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return { submitPaper, loading, error };
};
```

---

## 🚀 Deployment Notes

- **Environment Variables**: Ensure Supabase credentials are configured
- **File Size Limits**: Configure server limits for file uploads
- **CORS**: API endpoints are configured for cross-origin requests
- **Rate Limiting**: Consider implementing rate limiting for production

---

## 📞 Support

For API support or questions, refer to the backend documentation or contact the development team.

**API Version**: 1.0  
**Last Updated**: 2024-01-01
