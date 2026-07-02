package com.thrivewithtianna.metrics;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "weight_log")
public class WeightLog {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "logged_at", nullable = false)
    private Instant loggedAt;

    @Column(name = "weight_kg", nullable = false)
    private BigDecimal weightKg;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected WeightLog() {
    }

    public static WeightLog create(UUID userId, Instant loggedAt, BigDecimal weightKg) {
        WeightLog log = new WeightLog();
        log.id = UUID.randomUUID();
        log.userId = userId;
        log.loggedAt = loggedAt;
        log.weightKg = weightKg;
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

    public UUID getUserId() {
        return userId;
    }

    public Instant getLoggedAt() {
        return loggedAt;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }
}
