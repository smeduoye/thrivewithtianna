package com.thrivewithtianna.metrics;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public final class MetricsDtos {

    private MetricsDtos() {
    }

    public record WeightLogRequest(
            @NotNull Instant loggedAt,
            @NotNull @Positive BigDecimal weightKg) {
    }

    public record WeightLogResponse(UUID id, Instant loggedAt, BigDecimal weightKg) {
        public static WeightLogResponse from(WeightLog log) {
            return new WeightLogResponse(log.getId(), log.getLoggedAt(), log.getWeightKg());
        }
    }

    public record SleepLogRequest(
            @NotNull LocalDate logDate,
            @NotNull @DecimalMin("0.5") @DecimalMax("24") BigDecimal hours,
            @DecimalMin("1") @DecimalMax("5") Short quality) {
    }

    public record SleepLogResponse(UUID id, LocalDate logDate, BigDecimal hours, Short quality) {
        public static SleepLogResponse from(SleepLog log) {
            return new SleepLogResponse(log.getId(), log.getLogDate(), log.getHours(), log.getQuality());
        }
    }

    public record SymptomLogRequest(
            @NotNull Instant loggedAt,
            @NotBlank String symptom,
            @NotBlank String severity,
            String notes) {
    }

    public record SymptomLogResponse(UUID id, Instant loggedAt, String symptom, String severity, String notes) {
        public static SymptomLogResponse from(SymptomLog log) {
            return new SymptomLogResponse(
                    log.getId(), log.getLoggedAt(), log.getSymptom(), log.getSeverity(), log.getNotes());
        }
    }
}
