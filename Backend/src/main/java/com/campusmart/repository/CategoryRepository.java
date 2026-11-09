package com.campusmart.repository;

import com.campusmart.model.entity.Category;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    // Additional query methods if needed (e.g., findBySlug)
}

