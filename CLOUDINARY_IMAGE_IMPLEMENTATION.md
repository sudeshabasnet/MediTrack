# Cloudinary Image Implementation for Products

**Date**: January 15, 2025  
**Feature**: Product Image Upload and Display using Cloudinary

---

## Overview

Added Cloudinary image upload functionality for medicines/products in the MediTrack system. Users can now upload product images when creating or editing medicines, and images are displayed in the product browser.

---

## Backend Changes

### 1. Dependencies
**File**: `backend/pom.xml`
- Added Cloudinary dependency:
  ```xml
  <dependency>
      <groupId>com.cloudinary</groupId>
      <artifactId>cloudinary-http44</artifactId>
      <version>1.38.0</version>
  </dependency>
  ```

### 2. Entity Updates
**File**: `backend/src/main/java/com/meditrack/entity/Medicine.java`
- Added `imageUrl` field:
  ```java
  @Column(columnDefinition = "TEXT")
  private String imageUrl;
  ```

### 3. DTO Updates
**File**: `backend/src/main/java/com/meditrack/dto/MedicineDto.java`
- Added `imageUrl` field to DTO
- Updated `fromEntity()` method to include imageUrl

### 4. Cloudinary Service
**File**: `backend/src/main/java/com/meditrack/service/CloudinaryService.java`
- New service class for Cloudinary integration
- Methods:
  - `uploadImage(MultipartFile file)`: Uploads image to Cloudinary
  - `deleteImage(String imageUrl)`: Deletes image from Cloudinary
- Images are stored in `meditrack/medicines/` folder on Cloudinary

### 5. Image Controller
**File**: `backend/src/main/java/com/meditrack/controller/ImageController.java`
- New controller for image uploads
- Endpoint: `POST /api/images/upload`
- Validates:
  - File type (must be image)
  - File size (max 10MB)
- Returns image URL after successful upload

### 6. Service Updates
**File**: `backend/src/main/java/com/meditrack/service/MedicineService.java`
- Updated `createMedicine()` to handle imageUrl
- Updated `updateMedicine()` to handle imageUrl (optional update)

### 7. Security Configuration
**File**: `backend/src/main/java/com/meditrack/config/SecurityConfig.java`
- Added `/api/images/**` to authenticated endpoints

---

## Frontend Changes

### 1. Add/Edit Medicine Form
**File**: `frontend/src/pages/admin/AddEditMedicine.jsx`
- Added `imageUrl` to formData state
- Added `imageUploading` and `imagePreview` states
- Added `handleImageUpload()` function:
  - Validates file type and size
  - Uploads to `/api/images/upload`
  - Updates formData with imageUrl
  - Shows preview
- Added image upload UI:
  - File input with image preview
  - Upload progress indicator
  - Image preview display

### 2. Medicine Browser
**File**: `frontend/src/pages/pharmacy/PharmacyMedicineBrowser.jsx`
- Updated medicine cards to display images:
  - Shows product image if available
  - Fallback to placeholder if no image
  - Image error handling
- Improved card layout with image section

---

## API Endpoints

### Upload Image
- **Endpoint**: `POST /api/images/upload`
- **Authentication**: Required
- **Request**: `multipart/form-data` with `file` field
- **Response**:
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/...",
    "message": "Image uploaded successfully"
  }
  ```

### Medicine Endpoints
- All medicine endpoints now support `imageUrl` field:
  - `POST /api/admin/medicines`
  - `PUT /api/admin/medicines/{id}`
  - `POST /api/supplier/medicines`
  - `PUT /api/supplier/medicines/{id}`

---

## Configuration

### Cloudinary Settings
**File**: `backend/src/main/resources/application.properties`
```properties
cloudinary.cloud.name=djyloeohk
cloudinary.api.key=994442518346973
cloudinary.api.secret=wzNXCA0Csr1JFNth88cyNttGdK8
cloudinary.url=cloudinary://994442518346973:wzNXCA0Csr1JFNth88cyNttGdK8@djyloeohk
```

### File Upload Limits
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## Usage

### For Admins/Suppliers (Adding Medicine)
1. Navigate to Add/Edit Medicine page
2. Fill in medicine details
3. Click "Choose File" in Product Image section
4. Select an image file (max 10MB)
5. Image uploads automatically and preview appears
6. Submit form to save medicine with image

### For Users (Viewing Medicines)
1. Navigate to Products page (`/pharmacy/medicines`)
2. Browse medicines with images displayed
3. Images show in product cards

---

## Features

✅ Image upload to Cloudinary  
✅ Image preview before submission  
✅ Image display in product browser  
✅ Fallback for missing images  
✅ File type validation (images only)  
✅ File size validation (10MB max)  
✅ Error handling  
✅ Loading states  

---

## File Structure

```
backend/
├── src/main/java/com/meditrack/
│   ├── entity/Medicine.java (updated)
│   ├── dto/MedicineDto.java (updated)
│   ├── service/
│   │   ├── CloudinaryService.java (new)
│   │   └── MedicineService.java (updated)
│   ├── controller/
│   │   └── ImageController.java (new)
│   └── config/SecurityConfig.java (updated)
└── pom.xml (updated)

frontend/
└── src/pages/
    ├── admin/AddEditMedicine.jsx (updated)
    └── pharmacy/PharmacyMedicineBrowser.jsx (updated)
```

---

## Testing

### Test Image Upload
1. Login as Admin or Supplier
2. Go to Add Medicine page
3. Upload an image
4. Verify preview appears
5. Submit form
6. Verify image URL is saved

### Test Image Display
1. Login as User or Pharmacy
2. Go to Products page
3. Verify images display in product cards
4. Verify fallback for medicines without images

---

## Status

✅ **IMPLEMENTATION COMPLETE**

All features have been implemented and are ready for use.

---

**Note**: Make sure Cloudinary credentials are properly configured in `application.properties` before using the image upload feature.


