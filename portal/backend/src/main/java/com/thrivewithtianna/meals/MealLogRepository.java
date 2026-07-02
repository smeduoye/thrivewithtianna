package com.thrivewithtianna.meals;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MealLogRepository extends JpaRepository<MealLog, UUID> {

    List<MealLog> findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(
            UUID userId, Instant from, Instant to);

    Optional<MealLog> findByIdAndUserId(UUID id, UUID userId);
}
