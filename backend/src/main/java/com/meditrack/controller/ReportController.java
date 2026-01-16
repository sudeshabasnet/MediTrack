package com.meditrack.controller;

import com.meditrack.dto.MedicineDto;
import com.meditrack.entity.Medicine;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.service.MedicineService;
import com.meditrack.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final MedicineService medicineService;
    private final PredictionService predictionService;

    @GetMapping("/stock-summary")
    public ResponseEntity<Map<String, Object>> getStockSummary() {
        Map<String, Object> report = new HashMap<>();

        long totalMedicines = medicineRepository.count();
        long availableMedicines = medicineRepository.findAll().stream()
                .filter(m -> m.getStatus() == Medicine.Status.AVAILABLE)
                .count();
        long lowStockMedicines = medicineRepository.findLowStockMedicines().size();
        long outOfStockMedicines = medicineRepository.findAll().stream()
                .filter(m -> m.getStatus() == Medicine.Status.OUT_OF_STOCK)
                .count();

        report.put("totalMedicines", totalMedicines);
        report.put("availableMedicines", availableMedicines);
        report.put("lowStockMedicines", lowStockMedicines);
        report.put("outOfStockMedicines", outOfStockMedicines);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/expiry-report")
    public ResponseEntity<Map<String, Object>> getExpiryReport(
            @RequestParam(defaultValue = "30") int days) {
        Map<String, Object> report = new HashMap<>();

        LocalDate expiryDate = LocalDate.now().plusDays(days);
        var nearExpiryMedicines = medicineRepository.findNearExpiryMedicines(expiryDate);

        report.put("days", days);
        report.put("totalMedicinesExpiring", nearExpiryMedicines.size());
        report.put("medicines", nearExpiryMedicines);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/category-distribution")
    public ResponseEntity<Map<String, Object>> getCategoryDistribution() {
        Map<String, Object> report = new HashMap<>();
        Map<String, Long> distribution = new HashMap<>();

        distribution = medicineRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(Medicine::getCategory,
                        java.util.stream.Collectors.counting()));

        report.put("distribution", distribution);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/supplier-summary")
    public ResponseEntity<Map<String, Object>> getSupplierSummary() {
        Map<String, Object> report = new HashMap<>();

        long totalSuppliers = userRepository.countByRole(com.meditrack.entity.User.Role.SUPPLIER);
        long totalPharmacies = userRepository.countByRole(com.meditrack.entity.User.Role.PHARMACY);

        report.put("totalSuppliers", totalSuppliers);
        report.put("totalPharmacies", totalPharmacies);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/low-stock-report")
    public ResponseEntity<Map<String, Object>> getLowStockReport() {
        Map<String, Object> report = new HashMap<>();

        var lowStockMedicines = medicineRepository.findLowStockMedicines();

        report.put("totalLowStockMedicines", lowStockMedicines.size());
        report.put("medicines", lowStockMedicines);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/expiry-prediction")
    public ResponseEntity<Map<String, Object>> getExpiryPrediction() {
        // Get all medicines
        List<MedicineDto> medicines = medicineService.getAllMedicines();

        // Get expiry alerts from Python module
        Map<String, Object> predictionResult = predictionService.getExpiryAlerts(medicines);

        Map<String, Object> report = new HashMap<>();
        report.put("predictionService", "Python AI Module");
        report.put("alerts", predictionResult.get("alerts"));
        report.put("totalAlerts",
                ((List<?>) predictionResult.getOrDefault("alerts", java.util.Collections.emptyList())).size());

        return ResponseEntity.ok(report);
    }

    @GetMapping("/stock-recommendations")
    public ResponseEntity<Map<String, Object>> getStockRecommendations() {
        // Get all medicines
        List<MedicineDto> medicines = medicineService.getAllMedicines();

        // Get usage history (placeholder - can be enhanced with actual order history)
        List<Map<String, Object>> usageHistory = java.util.Collections.emptyList();

        // Get recommendations from Python module
        Map<String, Object> recommendations = predictionService.getStockRecommendations(medicines, usageHistory);

        Map<String, Object> report = new HashMap<>();
        report.put("predictionService", "Python AI Module");
        report.put("recommendations", recommendations.get("recommendations"));
        report.put("totalRecommendations",
                ((List<?>) recommendations.getOrDefault("recommendations", java.util.Collections.emptyList())).size());

        return ResponseEntity.ok(report);
    }
}
