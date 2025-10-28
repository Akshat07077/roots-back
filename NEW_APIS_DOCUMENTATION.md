# 📚 New APIs Documentation - Contact & Editorial Board

## 🆕 New Features Added

### 1. Contact Us System
- **API**: `/api/contact`
- **Purpose**: Handle contact form submissions
- **Database**: `contact_us` table

### 2. Editorial Board Management
- **API**: `/api/editorial-board`
- **Purpose**: Manage editorial board members
- **Database**: `editorial_board` table

---

## 📋 Contact Us API

### Endpoint: `/api/contact`

#### POST - Submit Contact Form
**Purpose**: Save contact form submissions

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about submission",
  "message": "I have a question about the submission process...",
  "phone": "+1234567890",
  "organization": "University of Example"
}
```

**Required Fields**:
- `name` (string): Full name
- `email` (string): Valid email address
- `subject` (string): Message subject
- `message` (string): Message content

**Optional Fields**:
- `phone` (string): Phone number
- `organization` (string): Organization name

**Response**:
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "contact": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about submission",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET - Retrieve Contact Submissions (Admin)
**Purpose**: Get all contact form submissions

**Response**:
```json
{
  "contacts": [
    {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Question about submission",
      "message": "I have a question...",
      "phone": "+1234567890",
      "organization": "University of Example",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 👥 Editorial Board API

### Endpoint: `/api/editorial-board`

#### GET - Get Editorial Board Members
**Purpose**: Retrieve active editorial board members

**Response**:
```json
{
  "members": [
    {
      "id": "uuid-here",
      "name": "Dr. Jane Smith",
      "title": "Professor of Computer Science",
      "affiliation": "MIT",
      "email": "jane@mit.edu",
      "bio": "Expert in machine learning...",
      "photo_url": "https://example.com/photo.jpg",
      "order_index": 1,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST - Add Editorial Board Member
**Purpose**: Add new editorial board member

**Request Body**:
```json
{
  "name": "Dr. Jane Smith",
  "title": "Professor of Computer Science",
  "affiliation": "MIT",
  "email": "jane@mit.edu",
  "bio": "Expert in machine learning and AI...",
  "photo_url": "https://example.com/photo.jpg",
  "order_index": 1
}
```

**Required Fields**:
- `name` (string): Member's full name
- `title` (string): Professional title
- `affiliation` (string): Institution/organization

**Optional Fields**:
- `email` (string): Valid email address
- `bio` (string): Biography
- `photo_url` (string): Profile photo URL
- `order_index` (number): Display order (default: 0)

**Response**:
```json
{
  "success": true,
  "message": "Editorial board member added successfully",
  "member": {
    "id": "uuid-here",
    "name": "Dr. Jane Smith",
    "title": "Professor of Computer Science",
    "affiliation": "MIT",
    "email": "jane@mit.edu",
    "bio": "Expert in machine learning...",
    "photo_url": "https://example.com/photo.jpg",
    "order_index": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT - Update Editorial Board Member
**Purpose**: Update existing editorial board member

**Request Body**:
```json
{
  "id": "uuid-here",
  "name": "Dr. Jane Smith",
  "title": "Professor of Computer Science",
  "affiliation": "MIT",
  "email": "jane@mit.edu",
  "bio": "Updated biography...",
  "photo_url": "https://example.com/new-photo.jpg",
  "order_index": 2,
  "is_active": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Editorial board member updated successfully",
  "member": {
    "id": "uuid-here",
    "name": "Dr. Jane Smith",
    "title": "Professor of Computer Science",
    "affiliation": "MIT",
    "email": "jane@mit.edu",
    "bio": "Updated biography...",
    "photo_url": "https://example.com/new-photo.jpg",
    "order_index": 2,
    "is_active": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE - Delete Editorial Board Member
**Purpose**: Soft delete editorial board member (sets is_active to false)

**Query Parameters**:
- `id` (string, required): Member ID

**Response**:
```json
{
  "success": true,
  "message": "Editorial board member deleted successfully"
}
```

---

## 🗄️ Database Schema

### Contact Us Table
```sql
CREATE TABLE contact_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Editorial Board Table
```sql
CREATE TABLE editorial_board (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 Frontend Pages

### 1. Contact Us Page (`/contact`)
- **Purpose**: Public contact form
- **Features**:
  - Form validation
  - Success/error messages
  - Responsive design
  - Contact information display

### 2. Editorial Board Management (`/editorial-board`)
- **Purpose**: Admin interface for managing editorial board
- **Features**:
  - Add new members
  - Edit existing members
  - Delete members (soft delete)
  - Form validation
  - Member list with photos

### 3. Public Editorial Board (`/about/editorial-board`)
- **Purpose**: Public display of editorial board
- **Features**:
  - Grid layout of members
  - Member photos and bios
  - Contact information
  - Call-to-action for joining

---

## 🔧 Usage Examples

### Contact Form Submission
```javascript
const submitContactForm = async (formData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Contact form submitted:', data.contact);
  } else {
    console.error('Error:', data.error);
  }
};
```

### Get Editorial Board Members
```javascript
const getEditorialBoard = async () => {
  const response = await fetch('/api/editorial-board');
  const data = await response.json();
  
  if (response.ok) {
    return data.members;
  } else {
    console.error('Error:', data.error);
    return [];
  }
};
```

### Add Editorial Board Member
```javascript
const addEditorialMember = async (memberData) => {
  const response = await fetch('/api/editorial-board', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('Member added:', data.member);
  } else {
    console.error('Error:', data.error);
  }
};
```

---

## 🚨 Error Handling

### Common Error Responses
```json
{
  "error": "Name, email, subject, and message are required"
}
```

```json
{
  "error": "Please provide a valid email address"
}
```

```json
{
  "error": "Member ID is required for update"
}
```

```json
{
  "error": "Editorial board member not found"
}
```

---

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on both tables
- **Public access** for contact form submissions
- **Public read access** for active editorial board members
- **Service role required** for admin operations
- **Input validation** for all fields
- **Email format validation**
- **SQL injection protection** via Supabase

---

## 🚀 Next Steps

1. **Update Supabase Schema**: Run the updated SQL schema
2. **Test APIs**: Use the provided frontend pages to test
3. **Customize Styling**: Modify Tailwind classes as needed
4. **Add Email Notifications**: Integrate with email service
5. **Add File Uploads**: For editorial board member photos
6. **Add Search/Filter**: For editorial board members
7. **Add Pagination**: For large lists

---

## 📞 Support

For questions about these new APIs, refer to the main API documentation or contact the development team.

**Last Updated**: 2024-01-01
