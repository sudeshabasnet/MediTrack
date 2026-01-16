$ErrorActionPreference = "Stop"

Write-Host "Seeding V2 medicines..." -ForegroundColor Cyan

$BASE_URL = "http://localhost:8081/api"
$SUPPLIER_EMAIL = "supplier@test.com"
$SUPPLIER_PASSWORD = "supplier123"

# Login
Write-Host "Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email    = $SUPPLIER_EMAIL
    password = $SUPPLIER_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $TOKEN = $loginResponse.token
}
catch {
    Write-Host "Creating supplier..."
    $registerBody = @{
        fullName         = "Test Supplier"
        email            = $SUPPLIER_EMAIL
        password         = $SUPPLIER_PASSWORD
        phoneNumber      = "+977-1-9876544"
        role             = "SUPPLIER"
        organizationName = "ABC Pharmaceuticals"
        licenseNumber    = "SUP-TEST-002"
        address          = "Kathmandu, Nepal"
    } | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
        $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $TOKEN = $loginResponse.token
    }
    catch {
        Write-Host "Failed to register/login: $_"
        exit 1
    }
}

$headers = @{ Authorization = "Bearer $TOKEN" }
$SUPPLIER_ID = (Invoke-RestMethod -Uri "$BASE_URL/auth/profile" -Method Get -Headers $headers).id

$medicines = @(
    @{ name = "Paracetamol 500mg V2"; category = "PAINKILLER"; genericName = "Paracetamol"; manufacturer = "ABC Pharma"; description = "Pain relief"; unitPrice = 50.00; currentStock = 1000; minStockLevel = 100; expiryDate = "2026-12-31"; batchNumber = "PAR-2024-001-V2"; imageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop" },
    @{ name = "Amoxicillin 250mg V2"; category = "ANTIBIOTIC"; genericName = "Amoxicillin"; manufacturer = "XYZ Pharma"; description = "Antibiotic"; unitPrice = 150.00; currentStock = 500; minStockLevel = 50; expiryDate = "2026-06-30"; batchNumber = "AMX-2024-002-V2"; imageUrl = "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop" },
    @{ name = "Vitamin C 500mg V2"; category = "VITAMIN"; genericName = "Ascorbic Acid"; manufacturer = "Health Plus"; description = "Immunity"; unitPrice = 80.00; currentStock = 750; minStockLevel = 75; expiryDate = "2027-03-31"; batchNumber = "VIT-C-2024-003-V2"; imageUrl = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop" },
    @{ name = "Ibuprofen 400mg V2"; category = "PAINKILLER"; genericName = "Ibuprofen"; manufacturer = "MediCorp"; description = "Pain relief"; unitPrice = 65.00; currentStock = 600; minStockLevel = 60; expiryDate = "2026-09-30"; batchNumber = "IBU-2024-004-V2"; imageUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop" },
    @{ name = "Azithromycin 500mg V2"; category = "ANTIBIOTIC"; genericName = "Azithromycin"; manufacturer = "PharmaTech"; description = "Antibiotic"; unitPrice = 200.00; currentStock = 300; minStockLevel = 30; expiryDate = "2026-08-31"; batchNumber = "AZI-2024-005-V2"; imageUrl = "https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop" }
)

foreach ($med in $medicines) {
    $med["supplierId"] = $SUPPLIER_ID
    $body = $med | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$BASE_URL/supplier/medicines" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "✅ Added $($med.name)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed $($med.name): $_" -ForegroundColor Red
    }
}
Write-Host "Done."
