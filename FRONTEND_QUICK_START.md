# 🚀 Frontend Quick Start Guide

## 📋 API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/upload` | POST | Upload paper with user info | No |
| `/api/articles` | GET | Get approved articles | No |
| `/api/admin/approve` | GET | Get all articles (admin) | No |
| `/api/admin/approve` | PATCH | Approve/reject article | No |
| `/api/user-submissions` | GET | Get user's submissions | No |

## 🎯 Essential API Calls

### 1. Upload Paper
```javascript
const formData = new FormData();
formData.append('title', 'My Research Paper');
formData.append('authorName', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('mobileNumber', '+1234567890');
formData.append('file', docxFile); // File object
formData.append('paymentScreenshot', imageFile); // Optional

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### 2. Get Approved Articles
```javascript
const response = await fetch('/api/articles');
const data = await response.json();
// data.articles contains approved papers
```

### 3. Admin: Get All Articles
```javascript
const response = await fetch('/api/admin/approve');
const data = await response.json();
// data.articles contains all papers
```

### 4. Admin: Approve/Reject
```javascript
const response = await fetch('/api/admin/approve', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'article-uuid',
    status: 'approved' // or 'rejected'
  })
});
```

### 5. Get User Submissions
```javascript
const response = await fetch(`/api/user-submissions?email=${encodeURIComponent('user@example.com')}`);
const data = await response.json();
// data.user contains user info and articles
```

## 📊 Data Structures

### Article Object
```javascript
{
  id: "uuid",
  title: "Paper Title",
  author_name: "Author Name",
  docx_url: "https://storage-url/file.docx",
  payment_screenshot_url: "https://storage-url/payment.png", // Optional
  status: "pending" | "approved" | "rejected",
  created_at: "2024-01-01T00:00:00.000Z"
}
```

### User Object
```javascript
{
  id: "uuid",
  email: "user@example.com",
  mobile_number: "+1234567890",
  author_name: "Author Name",
  created_at: "2024-01-01T00:00:00.000Z",
  articles: [/* Array of Article objects */]
}
```

## 🎨 UI Components You'll Need

### 1. Upload Form
- Title input (required)
- Author name input (required)
- Email input (required)
- Mobile number input (required)
- File upload (DOCX only, required)
- Payment screenshot upload (PNG/JPG, optional)
- Submit button

### 2. Article List
- Display approved articles
- Show title, author, date
- Download DOCX link
- View payment screenshot link (if available)

### 3. Admin Panel
- List all articles with status
- Approve/Reject buttons
- User contact information
- File download links

### 4. User Tracker
- Search by email
- Display user information
- Show all user's submissions
- Contact details

## 🔧 Form Validation

### Required Fields
- Title (string)
- Author Name (string)
- Email (valid email format)
- Mobile Number (string)
- DOCX File (file, .docx only)

### Optional Fields
- Payment Screenshot (file, PNG/JPG only)

### File Validation
```javascript
const validateFile = (file, type) => {
  if (type === 'docx') {
    return file.name.endsWith('.docx');
  }
  if (type === 'image') {
    return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
  }
  return false;
};
```

## 🚨 Error Handling

### Common Errors
- "File, title, author name, email, and mobile number are required"
- "Only DOCX files are allowed"
- "Payment screenshot must be PNG or JPG"
- "User not found"

### Error Handling Example
```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('API Error:', error.message);
    // Show error to user
    return null;
  }
};
```

## 📱 Responsive Design Notes

- Upload form should work on mobile
- File uploads need proper mobile support
- Admin panel should be desktop-friendly
- Article list should be responsive

## 🎯 Key Features to Implement

1. **Upload System**
   - Multi-step form or single page
   - File validation
   - Progress indicators
   - Success/error messages

2. **Public Archive**
   - Grid/list view of approved articles
   - Search and filter options
   - Pagination for large lists

3. **Admin Dashboard**
   - Table view of all submissions
   - Status management
   - User contact information
   - Bulk actions

4. **User Tracking**
   - Search by email
   - User profile view
   - Submission history
   - Contact information

## 🔗 File Downloads

All file URLs are direct download links:
- DOCX files: `article.docx_url`
- Payment screenshots: `article.payment_screenshot_url`

## 📞 Contact Information

Each user has:
- Email: `user.email`
- Mobile: `user.mobile_number`
- Name: `user.author_name`

## 🚀 Getting Started

1. **Set up your frontend project**
2. **Configure API base URL** (http://localhost:3000/api for development)
3. **Implement upload form** with all required fields
4. **Create article display components**
5. **Build admin interface** for approval workflow
6. **Add user tracking** for submission history

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete API reference with examples and TypeScript interfaces.

**Happy coding!** 🎉
