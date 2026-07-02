package com.thrivewithtianna.metrics;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SleepLogRepository extends JpaRepository<SleepLog, UUID> {

    List<SleepLog> findByUserIdAndLogDateBetweenOrderByLogDateDesc(
            UUID userId, LocalDate from, LocalDate to);

    Optional<SleepLog> findTopByUserIdOrderByLogDateDesc(UUID userId);

    Optional<SleepLog> findByUserIdAndLogDate(UUID userId, LocalDate logDate);
}
