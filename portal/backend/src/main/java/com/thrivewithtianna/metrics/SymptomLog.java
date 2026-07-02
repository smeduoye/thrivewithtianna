package com.thrivewithtianna.metrics;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "symptom_log")
public class SymptomLog {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "logged_at", nullable = false)
    private Instant loggedAt;

    @Column(nullable = false)
    private String symptom;

    @Column(nullable = false)
    private String severity = "mild";

    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected SymptomLog() {
    }

    public static SymptomLog create(UUID userId, Instant loggedAt, String symptom, String severity, String notes) {
        SymptomLog log = new SymptomLog();
        log.id = UUID.randomUUID();
        log.userId = userId;
        log.loggedAt = loggedAt;
        log.symptom = symptom;
        log.severity = severity;
        log.notes = notes;
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

    public Instant getLoggedAt() {
        return loggedAt;
    }

    public String getSymptom() {
        return symptom;
    }

    public String getSeverity() {
        return severity;
    }

    public String getNotes() {
        return notes;
    }
}
