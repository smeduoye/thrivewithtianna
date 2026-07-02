package com.thrivewithtianna.metrics;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightLogRepository extends JpaRepository<WeightLog, UUID> {

    List<WeightLog> findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(
            UUID userId, Instant from, Instant to);

    Optional<WeightLog> findTopByUserIdOrderByLoggedAtDesc(UUID userId);
}
