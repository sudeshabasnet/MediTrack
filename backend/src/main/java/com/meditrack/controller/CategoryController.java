package com.meditrack.controller;

import com.meditrack.entity.Category;
import com.meditrack.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam(required = false, defaultValue = "true") Boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(categoryRepository.findByActiveTrueOrderByNameAsc());
        }
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String icon = (String) request.get("icon");
        String description = (String) request.get("description");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if category already exists
        if (categoryRepository.existsByNameIgnoreCase(name.trim())) {
            return ResponseEntity.badRequest().build();
        }

        Category category = new Category();
        category.setName(name.trim());
        category.setIcon(icon != null ? icon.trim() : null);
        category.setDescription(description != null ? description.trim() : null);
        category.setActive(true);

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (request.containsKey("name")) {
            String name = (String) request.get("name");
            if (name != null && !name.trim().isEmpty()) {
                // Check if another category with this name exists
                categoryRepository.findByNameIgnoreCase(name.trim())
                        .ifPresent(existing -> {
                            if (!existing.getId().equals(id)) {
                                throw new RuntimeException("Category name already exists");
                            }
                        });
                category.setName(name.trim());
            }
        }

        if (request.containsKey("icon")) {
            category.setIcon((String) request.get("icon"));
        }

        if (request.containsKey("description")) {
            category.setDescription((String) request.get("description"));
        }

        if (request.containsKey("active")) {
            category.setActive((Boolean) request.get("active"));
        }

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Soft delete by setting active to false
        category.setActive(false);
        categoryRepository.save(category);
        return ResponseEntity.ok().build();
    }
}











