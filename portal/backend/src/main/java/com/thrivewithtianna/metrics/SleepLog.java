package com.thrivewithtianna.metrics;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "sleep_log")
public class SleepLog {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private BigDecimal hours;

    private Short quality;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected SleepLog() {
    }

    public static SleepLog create(UUID userId, LocalDate logDate, BigDecimal hours, Short quality) {
        SleepLog log = new SleepLog();
        log.id = UUID.randomUUID();
        log.userId = userId;
        log.logDate = logDate;
        log.hours = hours;
        log.quality = quality;
        return log;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public BigDecimal getHours() {
        return hours;
    }

    public Short getQuality() {
        return quality;
    }
}
