package com.meditrack.repository;

import com.meditrack.entity.Medicine;
import com.meditrack.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Page<Medicine> findBySupplier(User supplier, Pageable pageable);

    @Query("SELECT m FROM Medicine m WHERE " +
            "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.category) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(m.batchNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:category IS NULL OR m.category = :category) AND " +
            "(:status IS NULL OR m.status = :status) AND " +
            "(:supplierId IS NULL OR m.supplier.id = :supplierId)")
    Page<Medicine> searchMedicines(@Param("search") String search,
            @Param("category") String category,
            @Param("status") Medicine.Status status,
            @Param("supplierId") Long supplierId,
            Pageable pageable);

    List<Medicine> findByCurrentStockLessThanEqual(Integer minStockLevel);

    List<Medicine> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT m FROM Medicine m WHERE m.currentStock <= m.minStockLevel")
    List<Medicine> findLowStockMedicines();

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate <= :date")
    List<Medicine> findNearExpiryMedicines(@Param("date") LocalDate date);
}
