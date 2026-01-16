package com.meditrack.repository;

import com.meditrack.entity.CartItem;
import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndMedicineId(User user, Long medicineId);
    void deleteByUser(User user);
}



