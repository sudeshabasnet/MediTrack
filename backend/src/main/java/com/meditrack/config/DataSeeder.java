package com.meditrack.config;

import com.meditrack.entity.Medicine;
import com.meditrack.entity.User;
import com.meditrack.entity.Category;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final MedicineRepository medicineRepository;
        private final UserRepository userRepository;
        private final CategoryRepository categoryRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) {
                // Seed categories first
                seedCategories();

                // Check if medicines already exist
                long medicineCount = medicineRepository.count();

                if (medicineCount > 0) {
                        log.info("Medicines already exist in database ({} medicines found). Skipping seed data.",
                                        medicineCount);
                        return;
                }

                log.info("No medicines found in database. Starting seed data insertion...");

                // Get or create a supplier
                User supplier = getOrCreateSupplier();

                // Create seed medicines
                List<Medicine> medicines = createSeedMedicines(supplier);

                // Save all medicines
                if (!medicines.isEmpty()) {
                        medicineRepository.saveAll(medicines);
                }

                log.info("Successfully seeded {} medicines into the database.", medicines.size());
        }

        private void seedCategories() {
                if (categoryRepository.count() > 0) {
                        log.info("Categories already exist. Skipping category seeding.");
                        return;
                }

                log.info("Seeding categories...");

                List<Category> categories = new ArrayList<>();

                categories.add(createCategory("Antibiotic", "💊", "Antibacterial medications"));
                categories.add(createCategory("Antiseptic", "🧴", "Antiseptic and disinfectant products"));
                categories.add(createCategory("Herbal", "🌿", "Natural herbal medicines"));
                categories.add(createCategory("Painkiller", "🩹", "Pain relief medications"));
                categories.add(createCategory("Vitamin", "💊", "Vitamin and mineral supplements"));
                categories.add(createCategory("Supplement", "💪", "Health supplements and nutritional products"));
                categories.add(createCategory("Other", "📦", "Other medications"));

                categoryRepository.saveAll(categories);
                log.info("Successfully seeded {} categories.", categories.size());
        }

        private Category createCategory(String name, String icon, String description) {
                Category category = new Category();
                category.setName(name);
                category.setIcon(icon);
                category.setDescription(description);
                category.setActive(true);
                return category;
        }

        private User getOrCreateSupplier() {
                return userRepository.findByEmail("seed-supplier@meditrack.com")
                                .orElseGet(() -> {
                                        log.info("Creating seed supplier user...");
                                        User newSupplier = new User();
                                        newSupplier.setFullName("Seed Supplier");
                                        newSupplier.setEmail("seed-supplier@meditrack.com");
                                        newSupplier.setPassword(passwordEncoder.encode("supplier123"));
                                        newSupplier.setPhoneNumber("+977-1-9999999");
                                        newSupplier.setRole(User.Role.SUPPLIER);
                                        newSupplier.setOrganizationName("Seed Pharmaceuticals");
                                        newSupplier.setLicenseNumber("SEED-SUP-001");
                                        newSupplier.setAddress("Kathmandu, Nepal");
                                        newSupplier.setActive(true);
                                        newSupplier.setEmailVerified(true);
                                        newSupplier.setVerificationStatus(User.VerificationStatus.VERIFIED);
                                        newSupplier.setCreatedAt(LocalDateTime.now());
                                        newSupplier.setUpdatedAt(LocalDateTime.now());
                                        return userRepository.save(newSupplier);
                                });
        }

        private List<Medicine> createSeedMedicines(User supplier) {
                List<Medicine> medicines = new ArrayList<>();

                // Herbal Medicines (5-6 products)
                medicines.add(createMedicine(
                                "Turmeric Capsules 500mg",
                                "HERBAL",
                                "Curcuma longa",
                                "HerbalCare",
                                "Natural anti-inflammatory and antioxidant supplement made from turmeric root",
                                new BigDecimal("120.00"),
                                800,
                                80,
                                LocalDate.now().plusYears(2),
                                "HERB-TUR-2024-001",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Ashwagandha Powder 100g",
                                "HERBAL",
                                "Withania somnifera",
                                "Ayurvedic Herbs",
                                "Traditional Ayurvedic herb for stress relief and energy boost",
                                new BigDecimal("250.00"),
                                500,
                                50,
                                LocalDate.now().plusYears(1),
                                "HERB-ASH-2024-002",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Ginger Root Extract 250mg",
                                "HERBAL",
                                "Zingiber officinale",
                                "Natural Remedies",
                                "Herbal supplement for digestive health and nausea relief",
                                new BigDecimal("95.00"),
                                700,
                                70,
                                LocalDate.now().plusYears(2),
                                "HERB-GIN-2024-003",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Tulsi (Holy Basil) Tea 25 Bags",
                                "HERBAL",
                                "Ocimum tenuiflorum",
                                "Herbal Teas",
                                "Traditional herbal tea for immunity and respiratory health",
                                new BigDecimal("180.00"),
                                600,
                                60,
                                LocalDate.now().plusYears(1),
                                "HERB-TUL-2024-004",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Neem Leaf Extract Capsules",
                                "HERBAL",
                                "Azadirachta indica",
                                "Ayurvedic Herbs",
                                "Natural blood purifier and skin health supplement",
                                new BigDecimal("150.00"),
                                550,
                                55,
                                LocalDate.now().plusYears(2),
                                "HERB-NEE-2024-005",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Triphala Powder 200g",
                                "HERBAL",
                                "Terminalia chebula, Terminalia bellirica, Phyllanthus emblica",
                                "Ayurvedic Herbs",
                                "Traditional Ayurvedic formula for digestive health",
                                new BigDecimal("220.00"),
                                450,
                                45,
                                LocalDate.now().plusYears(1),
                                "HERB-TRI-2024-006",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                // Regular Medicines (10-14 products)
                medicines.add(createMedicine(
                                "Paracetamol 500mg",
                                "PAINKILLER",
                                "Paracetamol",
                                "ABC Pharma",
                                "Effective pain relief and fever reducer",
                                new BigDecimal("50.00"),
                                1000,
                                100,
                                LocalDate.now().plusYears(2),
                                "PAR-2024-001",
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Amoxicillin 250mg",
                                "ANTIBIOTIC",
                                "Amoxicillin",
                                "XYZ Pharmaceuticals",
                                "Broad-spectrum antibiotic for bacterial infections",
                                new BigDecimal("150.00"),
                                500,
                                50,
                                LocalDate.now().plusYears(1),
                                "AMX-2024-002",
                                "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Vitamin C 500mg",
                                "VITAMIN",
                                "Ascorbic Acid",
                                "Health Plus",
                                "Boosts immunity and antioxidant support",
                                new BigDecimal("80.00"),
                                750,
                                75,
                                LocalDate.now().plusYears(2),
                                "VIT-C-2024-003",
                                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Ibuprofen 400mg",
                                "PAINKILLER",
                                "Ibuprofen",
                                "MediCorp",
                                "Anti-inflammatory pain reliever",
                                new BigDecimal("65.00"),
                                600,
                                60,
                                LocalDate.now().plusYears(1),
                                "IBU-2024-004",
                                "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Azithromycin 500mg",
                                "ANTIBIOTIC",
                                "Azithromycin",
                                "PharmaTech",
                                "Macrolide antibiotic for respiratory infections",
                                new BigDecimal("200.00"),
                                300,
                                30,
                                LocalDate.now().plusYears(1),
                                "AZI-2024-005",
                                "https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Calcium Carbonate 500mg",
                                "VITAMIN",
                                "Calcium Carbonate",
                                "NutriLife",
                                "Calcium supplement for bone health",
                                new BigDecimal("45.00"),
                                900,
                                90,
                                LocalDate.now().plusYears(2),
                                "CAL-2024-006",
                                "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Cetirizine 10mg",
                                "OTHER",
                                "Cetirizine",
                                "AllerMed",
                                "Antihistamine for allergy relief",
                                new BigDecimal("35.00"),
                                1200,
                                120,
                                LocalDate.now().plusYears(2),
                                "CET-2024-007",
                                "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Omeprazole 20mg",
                                "OTHER",
                                "Omeprazole",
                                "DigestCare",
                                "Proton pump inhibitor for acid reflux",
                                new BigDecimal("90.00"),
                                400,
                                40,
                                LocalDate.now().plusYears(1),
                                "OME-2024-008",
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Metformin 500mg",
                                "OTHER",
                                "Metformin",
                                "DiabetCare",
                                "Oral medication for type 2 diabetes",
                                new BigDecimal("55.00"),
                                550,
                                55,
                                LocalDate.now().plusYears(1),
                                "MET-2024-009",
                                "https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Aspirin 100mg",
                                "PAINKILLER",
                                "Acetylsalicylic Acid",
                                "CardioPharm",
                                "Blood thinner and pain reliever",
                                new BigDecimal("25.00"),
                                1500,
                                150,
                                LocalDate.now().plusYears(2),
                                "ASP-2024-010",
                                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Ciprofloxacin 500mg",
                                "ANTIBIOTIC",
                                "Ciprofloxacin",
                                "InfectionCare",
                                "Fluoroquinolone antibiotic",
                                new BigDecimal("180.00"),
                                350,
                                35,
                                LocalDate.now().plusYears(1),
                                "CIP-2024-011",
                                "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Vitamin D3 1000IU",
                                "VITAMIN",
                                "Cholecalciferol",
                                "SunVit",
                                "Vitamin D supplement for bone health",
                                new BigDecimal("70.00"),
                                800,
                                80,
                                LocalDate.now().plusYears(2),
                                "VIT-D-2024-012",
                                "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Loratadine 10mg",
                                "OTHER",
                                "Loratadine",
                                "AllerMed",
                                "Non-drowsy antihistamine",
                                new BigDecimal("40.00"),
                                1100,
                                110,
                                LocalDate.now().plusYears(2),
                                "LOR-2024-013",
                                "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Diclofenac 50mg",
                                "PAINKILLER",
                                "Diclofenac Sodium",
                                "PainRelief Inc",
                                "NSAID for pain and inflammation",
                                new BigDecimal("75.00"),
                                450,
                                45,
                                LocalDate.now().plusYears(1),
                                "DIC-2024-014",
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Folic Acid 5mg",
                                "VITAMIN",
                                "Folic Acid",
                                "MaternalCare",
                                "Essential for pregnancy and cell growth",
                                new BigDecimal("30.00"),
                                1300,
                                130,
                                LocalDate.now().plusYears(2),
                                "FOL-2024-015",
                                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Amlodipine 5mg",
                                "OTHER",
                                "Amlodipine",
                                "CardioPharm",
                                "Calcium channel blocker for hypertension",
                                new BigDecimal("85.00"),
                                380,
                                38,
                                LocalDate.now().plusYears(1),
                                "AML-2024-016",
                                "https://images.unsplash.com/photo-1632833233569-33d4c0c0f89a?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Betadine Antiseptic Solution 100ml",
                                "ANTISEPTIC",
                                "Povidone-Iodine",
                                "AntisepticCare",
                                "Topical antiseptic for wound care",
                                new BigDecimal("120.00"),
                                650,
                                65,
                                LocalDate.now().plusYears(2),
                                "ANT-BET-2024-017",
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Hydrogen Peroxide 3% 100ml",
                                "ANTISEPTIC",
                                "Hydrogen Peroxide",
                                "AntisepticCare",
                                "Antiseptic solution for cleaning wounds",
                                new BigDecimal("60.00"),
                                750,
                                75,
                                LocalDate.now().plusYears(2),
                                "ANT-HYD-2024-018",
                                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
                                supplier));

                medicines.add(createMedicine(
                                "Aloe Vera Gel 100g",
                                "HERBAL",
                                "Aloe barbadensis",
                                "Natural Remedies",
                                "Soothing herbal gel for skin care and minor burns",
                                new BigDecimal("110.00"),
                                600,
                                60,
                                LocalDate.now().plusYears(1),
                                "HERB-ALO-2024-007",
                                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
                                supplier));

                return medicines;
        }

        private Medicine createMedicine(
                        String name,
                        String category,
                        String genericName,
                        String manufacturer,
                        String description,
                        BigDecimal unitPrice,
                        Integer currentStock,
                        Integer minStockLevel,
                        LocalDate expiryDate,
                        String batchNumber,
                        String imageUrl,
                        User supplier) {

                Medicine medicine = new Medicine();
                medicine.setName(name);
                medicine.setCategory(category);
                medicine.setGenericName(genericName);
                medicine.setManufacturer(manufacturer);
                medicine.setDescription(description);
                medicine.setUnitPrice(unitPrice);
                medicine.setCurrentStock(currentStock);
                medicine.setMinStockLevel(minStockLevel);
                medicine.setExpiryDate(expiryDate);
                medicine.setBatchNumber(batchNumber);
                medicine.setImageUrl(imageUrl);
                medicine.setSupplier(supplier);
                medicine.setCreatedAt(LocalDateTime.now());
                medicine.setUpdatedAt(LocalDateTime.now());

                // Status will be set automatically by @PrePersist
                return medicine;
        }
}
