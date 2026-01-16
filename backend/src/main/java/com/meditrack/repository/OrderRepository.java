package com.meditrack.repository;

import com.meditrack.entity.Order;
import com.meditrack.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    Page<Order> findByUser(User user, Pageable pageable);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByUserAndStatus(User user, Order.OrderStatus status);
}



