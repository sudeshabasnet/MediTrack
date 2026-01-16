# Image Upload Testing Guide for Pharmacy

**Date**: January 15, 2025  
**Feature**: Cloudinary Image Upload for Products

---

## Prerequisites

1. **Backend Running**: Ensure Spring Boot backend is running on port 8081
2. **Frontend Running**: Ensure React frontend is running on port 3000
3. **Cloudinary Configured**: Verify credentials in `application.properties`
4. **Database**: MySQL database should be running

---

## Test Scenarios

### Scenario 1: Upload Image via API (Programmatic)

#### Step 1: Register/Login
```bash
# Register a user
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "testpass123",
    "phoneNumber": "+977-1-1234567",
    "address": "Test Address",
    "role": "USER"
  }'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
# Save the token from response
```

#### Step 2: Upload Image
```bash
# Upload image
curl -X POST http://localhost:8081/api/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.png"

# Response:
# {
#   "imageUrl": "https://res.cloudinary.com/...",
#   "message": "Image uploaded successfully"
# }
```

#### Step 3: Verify Pharmacy Endpoint
```bash
# Get medicines
curl -X GET http://localhost:8081/api/pharmacy/medicines \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Check if medicines have imageUrl field
```

---

### Scenario 2: Upload Image via Browser (UI)

#### For Suppliers/Admins

1. **Start Backend and Frontend**
   ```bash
   # Terminal 1: Backend
   cd backend
   ./mvnw spring-boot:run
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Login**
   - Navigate to: `http://localhost:3000/login`
   - Login as Supplier or Admin

3. **Add/Edit Medicine**
   - Admin: Go to `/admin/medicines/add`
   - Supplier: Go to `/supplier/medicines/add`
   - Or edit existing medicine

4. **Upload Image**
   - Scroll to "Product Image" section
   - Click "Choose File"
   - Select an image file (PNG, JPG, etc.)
   - Image uploads automatically
   - Preview appears below input
   - Wait for "Image uploaded successfully" message

5. **Save Medicine**
   - Fill other required fields
   - Click "Add Medicine" or "Update Medicine"
   - Medicine saved with image URL

#### For Users/Pharmacy (Viewing)

1. **Login**
   - Navigate to: `http://localhost:3000/login`
   - Login as User or Pharmacy

2. **View Products**
   - Navigate to: `http://localhost:3000/pharmacy/medicines`
   - Browse medicines
   - Verify images display in product cards
   - Check fallback for medicines without images

---

## Test Checklist

### Backend Tests

- [ ] Image upload endpoint accessible
- [ ] Authentication required for upload
- [ ] File type validation (images only)
- [ ] File size validation (max 10MB)
- [ ] Cloudinary upload successful
- [ ] Image URL returned correctly
- [ ] Medicine entity saves imageUrl
- [ ] Pharmacy endpoint returns imageUrl

### Frontend Tests

- [ ] Image upload form displays
- [ ] File input accepts images
- [ ] Upload triggers on file selection
- [ ] Loading state shows during upload
- [ ] Preview displays after upload
- [ ] Error messages show for invalid files
- [ ] Images display in pharmacy browser
- [ ] Fallback shows for missing images
- [ ] Image error handling works

### Integration Tests

- [ ] Upload image → Get URL → Save with medicine → Display in browser
- [ ] Edit medicine → Update image → Preview updates
- [ ] Multiple medicines with images display correctly
- [ ] Medicines without images show fallback

---

## Expected Behavior

### Image Upload
- ✅ File selected → Upload starts automatically
- ✅ Progress indicator shows
- ✅ Success message appears
- ✅ Preview displays uploaded image
- ✅ Image URL saved in formData

### Image Display
- ✅ Images load from Cloudinary
- ✅ Responsive image sizing
- ✅ Fallback for missing images
- ✅ Error handling for broken URLs

---

## Troubleshooting

### Image Upload Fails
1. Check backend is running
2. Verify Cloudinary credentials
3. Check file size (max 10MB)
4. Verify file type (images only)
5. Check authentication token

### Images Don't Display
1. Verify imageUrl saved in database
2. Check Cloudinary URL is accessible
3. Verify frontend image rendering
4. Check browser console for errors

### Backend Not Responding
1. Check if Spring Boot is running
2. Verify port 8081 is available
3. Check application logs
4. Restart backend if needed

---

## Test Data

### Sample Image URLs
After upload, you'll get URLs like:
```
https://res.cloudinary.com/djyloeohk/image/upload/v1234567890/meditrack/medicines/abc123.png
```

### Sample Medicine with Image
```json
{
  "name": "Paracetamol 500mg",
  "category": "PAINKILLER",
  "genericName": "Paracetamol",
  "manufacturer": "ABC Pharma",
  "unitPrice": 50.00,
  "currentStock": 100,
  "minStockLevel": 20,
  "expiryDate": "2025-12-31",
  "batchNumber": "BATCH001",
  "imageUrl": "https://res.cloudinary.com/..."
}
```

---

## API Endpoints

### Upload Image
```
POST /api/images/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
Body: file (image file)
```

### Get Medicines (Pharmacy)
```
GET /api/pharmacy/medicines
Authorization: Bearer {token}
```

### Create Medicine (Supplier)
```
POST /api/supplier/medicines
Authorization: Bearer {token}
Content-Type: application/json
Body: MedicineDto (with imageUrl)
```

---

## Status

✅ **Implementation Complete**  
✅ **Ready for Testing**

Once backend is running, follow the test scenarios above to verify image upload functionality.

---

**Note**: Make sure to start both backend and frontend servers before testing.


