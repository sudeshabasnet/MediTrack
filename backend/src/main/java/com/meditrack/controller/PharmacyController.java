package com.meditrack.controller;

import com.meditrack.dto.MedicineDto;
import com.meditrack.entity.Medicine;
import com.meditrack.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PharmacyController {
    private final MedicineRepository medicineRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Long> stats = new HashMap<>();

        long availableMedicines = medicineRepository.count();
        // TODO: Implement orders functionality
        long myOrders = 0L;
        long pendingOrders = 0L;

        stats.put("availableMedicines", availableMedicines);
        stats.put("myOrders", myOrders);
        stats.put("pendingOrders", pendingOrders);

        response.put("stats", stats);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medicines")
    @PreAuthorize("hasAnyRole('PHARMACY', 'USER')")
    public ResponseEntity<List<MedicineDto>> getAvailableMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> medicines = medicineRepository.searchMedicines(
                search, category, null, supplierId, pageable);

        List<MedicineDto> result = medicines.getContent().stream()
                .filter(m -> m.getCurrentStock() > 0)
                .map(MedicineDto::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/medicines/{id}")
    @PreAuthorize("hasAnyRole('PHARMACY', 'USER')")
    public ResponseEntity<MedicineDto> getMedicine(@PathVariable Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return ResponseEntity.ok(MedicineDto.fromEntity(medicine));
    }
}



