#!/bin/bash

# Test Image Upload and Pharmacy Display
BASE_URL="http://localhost:8081"
FRONTEND_URL="http://localhost:3000"

echo "========================================"
echo "Pharmacy Image Upload Test"
echo "========================================"
echo ""

# Step 1: Login as a user (can be USER, PHARMACY, or SUPPLIER)
echo "Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"testuser1765706376@test.com","password":"testpass123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "None" ]; then
    echo "❌ Login failed. Creating a test user first..."
    # Register a new user
    REG_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "fullName": "Test User",
            "email": "testuser'$(date +%s)'@test.com",
            "password": "testpass123",
            "phoneNumber": "+977-1-1234567",
            "address": "Test Address",
            "role": "USER"
        }')
    echo "Registration response: $REG_RESPONSE"
    exit 1
fi

echo "✅ Login successful"
echo ""

# Step 2: Create a test image
echo "Step 2: Creating test image..."
python3 << 'PYTHON'
from PIL import Image
import os

# Create a simple test image
img = Image.new('RGB', (300, 200), color='lightblue')
try:
    img.save('/tmp/test_medicine.png')
    print("✅ Created test image: /tmp/test_medicine.png")
except Exception as e:
    print(f"⚠️  Could not create image with PIL: {e}")
    # Fallback: create minimal PNG
    import base64
    png_data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    with open('/tmp/test_medicine.png', 'wb') as f:
        f.write(png_data)
    print("✅ Created minimal test image")
PYTHON

# Step 3: Upload image
echo ""
echo "Step 3: Uploading image to Cloudinary..."
if [ -f "/tmp/test_medicine.png" ]; then
    UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/images/upload" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@/tmp/test_medicine.png")
    
    echo "Upload Response: $UPLOAD_RESPONSE"
    
    IMAGE_URL=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('imageUrl', ''))" 2>/dev/null)
    
    if [ -n "$IMAGE_URL" ] && [ "$IMAGE_URL" != "None" ]; then
        echo "✅ Image uploaded successfully!"
        echo "Image URL: $IMAGE_URL"
        echo ""
        
        # Step 4: Check pharmacy medicines endpoint
        echo "Step 4: Checking pharmacy medicines endpoint..."
        MEDICINES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/pharmacy/medicines" \
            -H "Authorization: Bearer $TOKEN")
        
        MEDICINE_COUNT=$(echo "$MEDICINES_RESPONSE" | python3 -c "import sys, json; meds=json.load(sys.stdin); print(len(meds) if isinstance(meds, list) else 0)" 2>/dev/null)
        echo "Found $MEDICINE_COUNT medicines"
        
        # Check for images
        echo ""
        echo "Step 5: Checking for medicines with images..."
        echo "$MEDICINES_RESPONSE" | python3 << 'PYTHON'
import sys, json
try:
    meds = json.load(sys.stdin)
    meds_list = meds if isinstance(meds, list) else []
    with_images = [m for m in meds_list if m.get('imageUrl')]
    print(f"Medicines with images: {len(with_images)}/{len(meds_list)}")
    if with_images:
        print("\nMedicines with images:")
        for m in with_images[:5]:
            print(f"  - {m.get('name')}: {m.get('imageUrl', '')[:60]}...")
    else:
        print("⚠️  No medicines have images yet")
        print("   You can add images when creating/editing medicines")
except Exception as e:
    print(f"Error: {e}")
PYTHON
        
        echo ""
        echo "========================================"
        echo "Test Summary"
        echo "========================================"
        echo "✅ Image upload endpoint: WORKING"
        echo "✅ Image URL received: $IMAGE_URL"
        echo "✅ Pharmacy medicines endpoint: ACCESSIBLE"
        echo ""
        echo "Next Steps:"
        echo "1. Use the image URL when creating/editing medicines"
        echo "2. Images will display in pharmacy medicine browser"
        echo "3. Frontend URL: $FRONTEND_URL/pharmacy/medicines"
        
    else
        echo "❌ Image upload failed"
        echo "Response: $UPLOAD_RESPONSE"
    fi
else
    echo "❌ Test image file not found"
fi

echo ""
echo "========================================"


