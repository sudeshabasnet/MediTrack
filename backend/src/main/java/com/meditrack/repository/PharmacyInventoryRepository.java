package com.meditrack.repository;

import com.meditrack.entity.PharmacyInventory;
import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PharmacyInventoryRepository extends JpaRepository<PharmacyInventory, Long> {
    
    List<PharmacyInventory> findByPharmacyAndActiveTrue(User pharmacy);
    
    List<PharmacyInventory> findByPharmacyAndActiveTrueOrderByCreatedAtDesc(User pharmacy);
    
    List<PharmacyInventory> findByPharmacyAndSourceAndActiveTrue(User pharmacy, PharmacyInventory.InventorySource source);
    
    @Query("SELECT p FROM PharmacyInventory p WHERE p.pharmacy = :pharmacy AND p.active = true AND p.currentStock <= p.minStockLevel")
    List<PharmacyInventory> findLowStockItems(@Param("pharmacy") User pharmacy);
    
    @Query("SELECT p FROM PharmacyInventory p WHERE p.pharmacy = :pharmacy AND p.active = true AND p.expiryDate BETWEEN :startDate AND :endDate")
    List<PharmacyInventory> findExpiringItems(@Param("pharmacy") User pharmacy, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM PharmacyInventory p WHERE p.pharmacy = :pharmacy AND p.active = true AND p.expiryDate < :today")
    List<PharmacyInventory> findExpiredItems(@Param("pharmacy") User pharmacy, @Param("today") LocalDate today);
    
    @Query("SELECT p FROM PharmacyInventory p WHERE p.pharmacy = :pharmacy AND p.active = true AND p.category = :category")
    List<PharmacyInventory> findByPharmacyAndCategory(@Param("pharmacy") User pharmacy, @Param("category") String category);
}





