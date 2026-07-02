package com.thrivewithtianna.metrics;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SymptomLogRepository extends JpaRepository<SymptomLog, UUID> {

    List<SymptomLog> findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(
            UUID userId, Instant from, Instant to);
}
