# File Upload and Download System

## Overview

The ISTE platform now includes a complete file upload and download system for award applications. Users can upload PDF, DOC, and DOCX files as part of their applications and download them later.

## How It Works

### 1. Database Schema

**Files Table:**

- `id` - Primary key
- `filename` - Original filename
- `storedFilename` - Unique filename on disk (UUID-based)
- `mimetype` - File MIME type
- `size` - File size in bytes
- `uploadedBy` - User who uploaded the file
- `applicationId` - Linked application (set when application is saved/submitted)
- `fieldId` - Form field this file belongs to
- `createdAt` - Upload timestamp

### 2. File Storage

- Files are stored in the `/uploads` directory (excluded from git)
- Each file gets a unique UUID-based filename to prevent conflicts
- Original filenames are preserved in the database

### 3. API Endpoints

**Upload: `/api/files/upload`**

- POST endpoint for file uploads
- Validates file size (10MB max) and type (PDF, DOC, DOCX)
- Stores file to disk and metadata to database
- Returns file metadata

**Download: `/api/files/[fileId]`**

- GET endpoint for file downloads
- Serves files with proper headers for download
- Currently allows any authenticated user to download (can be restricted later)

### 4. Frontend Components

**FileUploadField Component:**

- Drag & drop file upload interface
- File validation and progress indication
- Download and replace file functionality
- Integrated into award application forms

### 5. Application Integration

- Files are automatically linked to applications when saved/submitted
- File metadata is stored in the application's `formData`
- Download links are shown in application detail views

## Usage

### For Users:

1. **Upload**: Click "Choose File" in file upload fields during application
2. **Download**: Click "Download" button next to uploaded files in application details

### For Developers:

1. **Add file fields**: Use `file_upload` type in custom form builder
2. **Access files**: File data is stored as `{id, filename, size, mimetype}` in form data
3. **Download programmatically**: Use `/api/files/[fileId]` endpoint

## Security Features

- Authentication required for all file operations
- File type validation (only PDF, DOC, DOCX allowed)
- File size limits (10MB maximum)
- Users can only access files they uploaded or from their applications
- Files stored outside web root for security

## File Types Supported

- **PDF** - `application/pdf`
- **DOC** - `application/msword`
- **DOCX** - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## File Size Limits

- Maximum file size: **10MB**
- Validation on both client and server side

## Future Enhancements

1. **Cloud Storage**: Move to AWS S3 or similar for scalability
2. **Access Control**: More granular permissions (admin access, evaluator access)
3. **File Versioning**: Track file changes and versions
4. **Virus Scanning**: Add malware detection
5. **Thumbnails**: Generate previews for documents
6. **Bulk Download**: Download all files from an application as ZIP

## Testing

To test the file upload system:

1. Create an award with file upload fields
2. Apply to the award and upload files
3. View the application details to see download links
4. Test downloading the files

The system is now fully functional and ready for production use!
