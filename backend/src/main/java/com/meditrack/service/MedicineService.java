package com.meditrack.service;

import com.meditrack.dto.MedicineDto;
import com.meditrack.entity.Medicine;
import com.meditrack.entity.User;
import com.meditrack.repository.MedicineRepository;
import com.meditrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    @Transactional
    public Medicine createMedicine(MedicineDto dto, Long supplierId) {
        User supplier = userRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setCategory(dto.getCategory());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setDescription(dto.getDescription());
        medicine.setUnitPrice(dto.getUnitPrice());
        medicine.setCurrentStock(dto.getCurrentStock());
        medicine.setMinStockLevel(dto.getMinStockLevel());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setBatchNumber(dto.getBatchNumber());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setSupplier(supplier);

        return medicineRepository.save(medicine);
    }

    @Transactional
    public Medicine updateMedicine(Long id, MedicineDto dto) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setName(dto.getName());
        medicine.setCategory(dto.getCategory());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setDescription(dto.getDescription());
        medicine.setUnitPrice(dto.getUnitPrice());
        medicine.setCurrentStock(dto.getCurrentStock());
        medicine.setMinStockLevel(dto.getMinStockLevel());
        medicine.setExpiryDate(dto.getExpiryDate());
        if (dto.getImageUrl() != null) {
            medicine.setImageUrl(dto.getImageUrl());
        }

        return medicineRepository.save(medicine);
    }

    @Transactional
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public MedicineDto getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
        return MedicineDto.fromEntity(medicine);
    }

    public Page<MedicineDto> searchMedicines(String search, String category,
            Medicine.Status status, Long supplierId,
            Pageable pageable) {
        Page<Medicine> medicines = medicineRepository.searchMedicines(
                search, category, status, supplierId, pageable);
        return medicines.map(MedicineDto::fromEntity);
    }

    public List<MedicineDto> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines().stream()
                .map(MedicineDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MedicineDto> getNearExpiryMedicines() {
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        return medicineRepository.findNearExpiryMedicines(thirtyDaysFromNow).stream()
                .map(MedicineDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MedicineDto> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(MedicineDto::fromEntity)
                .collect(Collectors.toList());
    }
}
