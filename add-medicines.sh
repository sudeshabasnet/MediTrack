#!/bin/bash

# Script to add 15-16 medicines with images to MediTrack

echo "Adding medicines to MediTrack..."

BASE_URL="http://localhost:8081/api"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="admin123"
SUPPLIER_EMAIL="supplier@test.com"
SUPPLIER_PASSWORD="supplier123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
if ! curl -s http://localhost:8081 > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running on http://localhost:8081${NC}"
    echo "Please start the backend first: cd backend && mvn spring-boot:run"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"

# Login as supplier to get token
echo -e "${YELLOW}Logging in as supplier...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$SUPPLIER_EMAIL\",
        \"password\": \"$SUPPLIER_PASSWORD\"
    }")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to login. Creating supplier first...${NC}"
    # Create supplier if doesn't exist
    curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"fullName\": \"Test Supplier\",
            \"email\": \"$SUPPLIER_EMAIL\",
            \"password\": \"$SUPPLIER_PASSWORD\",
            \"phoneNumber\": \"+977-1-9876544\",
            \"role\": \"SUPPLIER\",
            \"organizationName\": \"ABC Pharmaceuticals\",
            \"licenseNumber\": \"SUP-001\",
            \"address\": \"Kathmandu, Nepal\"
        }" > /dev/null
    
    # Try login again
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$SUPPLIER_EMAIL\",
            \"password\": \"$SUPPLIER_PASSWORD\"
        }")
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get authentication token${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Authenticated successfully${NC}"

# Get supplier ID
SUPPLIER_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
    -H "Authorization: Bearer $TOKEN")
SUPPLIER_ID=$(echo $SUPPLIER_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$SUPPLIER_ID" ]; then
    echo -e "${RED}❌ Failed to get supplier ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Supplier ID: $SUPPLIER_ID${NC}"
echo ""

# Medicines data with images
MEDICINES=(
    '{"name":"Paracetamol 500mg","category":"PAINKILLER","genericName":"Paracetamol","manufacturer":"ABC Pharma","description":"Effective pain relief and fever reducer","unitPrice":50.00,"currentStock":1000,"minStockLevel":100,"expiryDate":"2026-12-31","batchNumber":"PAR-2024-001","imageUrl":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"}'
    '{"name":"Amoxicillin 250mg","category":"ANTIBIOTIC","genericName":"Amoxicillin","manufacturer":"XYZ Pharmaceuticals","description":"Broad-spectrum antibiotic for bacterial infections","unitPrice":150.00,"currentStock":500,"minStockLevel":50,"expiryDate":"2026-06-30","batchNumber":"AMX-2024-002","imageUrl":"https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop"}'
    '{"name":"Vitamin C 500mg","category":"VITAMIN","genericName":"Ascorbic Acid","manufacturer":"Health Plus","description":"Boosts immunity and antioxidant support","unitPrice":80.00,"currentStock":750,"minStockLevel":75,"expiryDate":"2027-03-31","batchNumber":"VIT-C-2024-003","imageUrl":"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"}'
    '{"name":"Ibuprofen 400mg","category":"PAINKILLER","genericName":"Ibuprofen","manufacturer":"MediCorp","description":"Anti-inflammatory pain reliever","unitPrice":65.00,"currentStock":600,"minStockLevel":60,"expiryDate":"2026-09-30","batchNumber":"IBU-2024-004","imageUrl":"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"}'
    '{"name":"Azithromycin 500mg","category":"ANTIBIOTIC","genericName":"Azithromycin","manufacturer":"PharmaTech","description":"Macrolide antibiotic for respiratory infections","unitPrice":200.00,"currentStock":300,"minStockLevel":30,"expiryDate":"2026-08-31","batchNumber":"AZI-2024-005","imageUrl":"https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop"}'
    '{"name":"Calcium Carbonate 500mg","category":"VITAMIN","genericName":"Calcium Carbonate","manufacturer":"NutriLife","description":"Calcium supplement for bone health","unitPrice":45.00,"currentStock":900,"minStockLevel":90,"expiryDate":"2027-01-31","batchNumber":"CAL-2024-006","imageUrl":"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop"}'
    '{"name":"Cetirizine 10mg","category":"OTHER","genericName":"Cetirizine","manufacturer":"AllerMed","description":"Antihistamine for allergy relief","unitPrice":35.00,"currentStock":1200,"minStockLevel":120,"expiryDate":"2026-11-30","batchNumber":"CET-2024-007","imageUrl":"https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop"}'
    '{"name":"Omeprazole 20mg","category":"OTHER","genericName":"Omeprazole","manufacturer":"DigestCare","description":"Proton pump inhibitor for acid reflux","unitPrice":90.00,"currentStock":400,"minStockLevel":40,"expiryDate":"2026-07-31","batchNumber":"OME-2024-008","imageUrl":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"}'
    '{"name":"Metformin 500mg","category":"OTHER","genericName":"Metformin","manufacturer":"DiabetCare","description":"Oral medication for type 2 diabetes","unitPrice":55.00,"currentStock":550,"minStockLevel":55,"expiryDate":"2026-10-31","batchNumber":"MET-2024-009","imageUrl":"https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop"}'
    '{"name":"Aspirin 100mg","category":"PAINKILLER","genericName":"Acetylsalicylic Acid","manufacturer":"CardioPharm","description":"Blood thinner and pain reliever","unitPrice":25.00,"currentStock":1500,"minStockLevel":150,"expiryDate":"2027-02-28","batchNumber":"ASP-2024-010","imageUrl":"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"}'
    '{"name":"Ciprofloxacin 500mg","category":"ANTIBIOTIC","genericName":"Ciprofloxacin","manufacturer":"InfectionCare","description":"Fluoroquinolone antibiotic","unitPrice":180.00,"currentStock":350,"minStockLevel":35,"expiryDate":"2026-05-31","batchNumber":"CIP-2024-011","imageUrl":"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"}'
    '{"name":"Vitamin D3 1000IU","category":"VITAMIN","genericName":"Cholecalciferol","manufacturer":"SunVit","description":"Vitamin D supplement for bone health","unitPrice":70.00,"currentStock":800,"minStockLevel":80,"expiryDate":"2027-04-30","batchNumber":"VIT-D-2024-012","imageUrl":"https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop"}'
    '{"name":"Loratadine 10mg","category":"OTHER","genericName":"Loratadine","manufacturer":"AllerMed","description":"Non-drowsy antihistamine","unitPrice":40.00,"currentStock":1100,"minStockLevel":110,"expiryDate":"2026-12-31","batchNumber":"LOR-2024-013","imageUrl":"https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop"}'
    '{"name":"Diclofenac 50mg","category":"PAINKILLER","genericName":"Diclofenac Sodium","manufacturer":"PainRelief Inc","description":"NSAID for pain and inflammation","unitPrice":75.00,"currentStock":450,"minStockLevel":45,"expiryDate":"2026-08-31","batchNumber":"DIC-2024-014","imageUrl":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"}'
    '{"name":"Folic Acid 5mg","category":"VITAMIN","genericName":"Folic Acid","manufacturer":"MaternalCare","description":"Essential for pregnancy and cell growth","unitPrice":30.00,"currentStock":1300,"minStockLevel":130,"expiryDate":"2027-05-31","batchNumber":"FOL-2024-015","imageUrl":"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"}'
    '{"name":"Amlodipine 5mg","category":"OTHER","genericName":"Amlodipine","manufacturer":"CardioPharm","description":"Calcium channel blocker for hypertension","unitPrice":85.00,"currentStock":380,"minStockLevel":38,"expiryDate":"2026-09-30","batchNumber":"AML-2024-016","imageUrl":"https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop"}'
)

# Function to add medicine
add_medicine() {
    local medicine_data=$1
    local medicine_json=$(echo "$medicine_data" | sed "s/\"supplierId\":null/\"supplierId\":$SUPPLIER_ID/")
    
    response=$(curl -s -X POST "$BASE_URL/supplier/medicines" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$medicine_json")
    
    if echo "$response" | grep -q "\"id\""; then
        medicine_name=$(echo "$medicine_json" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
        echo -e "${GREEN}✅ Added: $medicine_name${NC}"
        return 0
    else
        if echo "$response" | grep -q "already exists\|duplicate"; then
            medicine_name=$(echo "$medicine_json" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
            echo -e "${YELLOW}⚠️  Already exists: $medicine_name${NC}"
            return 0
        else
            medicine_name=$(echo "$medicine_json" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
            echo -e "${RED}❌ Failed: $medicine_name${NC}"
            echo "Response: $response"
            return 1
        fi
    fi
}

# Add all medicines
echo -e "${YELLOW}Adding medicines...${NC}"
echo ""

success_count=0
for medicine in "${MEDICINES[@]}"; do
    if add_medicine "$medicine"; then
        ((success_count++))
    fi
    sleep 0.5  # Small delay to avoid overwhelming the server
done

echo ""
echo -e "${GREEN}✅ Successfully added $success_count medicines!${NC}"
echo ""
echo "You can now browse medicines at http://localhost:3000/pharmacy/medicines"

















