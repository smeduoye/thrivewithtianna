package com.thrivewithtianna.meals;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FoodItemRepository extends JpaRepository<FoodItem, UUID> {

    @Query("""
            SELECT f FROM FoodItem f
            WHERE :term = '' OR LOWER(f.searchName) LIKE LOWER(CONCAT('%', :term, '%'))
            ORDER BY f.name
            """)
    List<FoodItem> search(@Param("term") String term, org.springframework.data.domain.Pageable pageable);
}
