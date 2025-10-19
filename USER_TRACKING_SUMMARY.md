# 👤 User Tracking System - Complete Implementation

## ✅ What's Added

### Database Schema
- ✅ **Users Table**: Tracks user information (email, mobile, name)
- ✅ **Articles Table**: Links to users via `user_id` foreign key
- ✅ **User-Article Relationship**: One user can have multiple articles
- ✅ **Contact Information**: Email and mobile number for each user

### New Form Fields
- ✅ **Email Address**: Required field for user identification
- ✅ **Mobile Number**: Required field for contact
- ✅ **Author Name**: Required field for paper author
- ✅ **Paper Title**: Required field for paper title
- ✅ **DOCX File**: Required file upload
- ✅ **Payment Screenshot**: Optional image upload

### User Tracking Features
- ✅ **User Creation**: Automatically creates user if email doesn't exist
- ✅ **User Lookup**: Finds existing user by email
- ✅ **Submission History**: Track all submissions by a user
- ✅ **Contact Information**: View user's email and mobile
- ✅ **File Tracking**: See all files uploaded by a user

## 🗄️ Database Structure

### Users Table
```sql
users:
- id (UUID, Primary Key)
- email (VARCHAR, Unique, Required)
- mobile_number (VARCHAR, Required)
- author_name (VARCHAR, Required)
- created_at (TIMESTAMP)
```

### Articles Table (Updated)
```sql
articles:
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to users.id)
- title (VARCHAR, Required)
- author_name (VARCHAR, Required)
- docx_url (TEXT, Required)
- payment_screenshot_url (TEXT, Optional)
- status (VARCHAR, Default: 'pending')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🧪 How to Test

### 1. Update Database Schema
Run the updated SQL schema in Supabase:
```sql
-- Creates users table and updates articles table
-- Adds user_id foreign key relationship
-- Sets up proper security policies
```

### 2. Test Upload with User Info
1. Go to [http://localhost:3000/upload-test](http://localhost:3000/upload-test)
2. Fill in all fields:
   - **Paper Title**: "My Research Paper"
   - **Author Name**: "John Doe"
   - **Email**: "john@example.com"
   - **Mobile**: "+1234567890"
   - **DOCX File**: Upload your paper
   - **Payment Screenshot**: Upload image (optional)
3. Click "Upload File"

### 3. Test User Tracking
1. Go to [http://localhost:3000/user-submissions](http://localhost:3000/user-submissions)
2. Enter the email address you used
3. Click "Search"
4. See all submissions by that user

## 📋 New API Endpoints

### GET /api/user-submissions?email=user@example.com
Returns user information and all their submissions:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "mobile_number": "+1234567890",
    "author_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "articles": [
      {
        "id": "uuid",
        "title": "Paper Title",
        "docx_url": "https://...",
        "payment_screenshot_url": "https://...",
        "status": "pending",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## 🎯 What You Can Track Now

### For Each User:
- ✅ **Contact Information**: Email and mobile number
- ✅ **Submission History**: All papers uploaded
- ✅ **File Access**: Download all DOCX files
- ✅ **Payment Proof**: View all payment screenshots
- ✅ **Status Tracking**: See approval status of each paper
- ✅ **Timeline**: When each submission was made

### For Admins:
- ✅ **User Lookup**: Find user by email
- ✅ **Complete History**: See all submissions by a user
- ✅ **Contact Details**: Get user's email and mobile
- ✅ **File Management**: Access all user's files
- ✅ **Payment Tracking**: See all payment screenshots

## 🔍 User Tracking Workflow

1. **User Uploads Paper**:
   - System checks if email exists
   - Creates new user if not found
   - Links article to user
   - Stores all files and contact info

2. **Admin Reviews**:
   - Can see user information
   - Can track all submissions by user
   - Can contact user via email/mobile
   - Can view all files and payments

3. **User Lookup**:
   - Search by email address
   - See complete submission history
   - Access all files and payment proofs
   - Track approval status

## 🚀 Benefits

- ✅ **Complete User Tracking**: Know who uploaded what
- ✅ **Contact Information**: Email and mobile for each user
- ✅ **Submission History**: See all papers by a user
- ✅ **File Organization**: All files linked to users
- ✅ **Payment Tracking**: Track payment proofs by user
- ✅ **Admin Control**: Full visibility into user activity

**Your academic archive now has complete user tracking and contact management!** 🎯
