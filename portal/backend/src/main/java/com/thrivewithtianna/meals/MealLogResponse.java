package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MealLogResponse(
        UUID id,
        Instant loggedAt,
        String mealSlot,
        BigDecimal totalGl,
        String notes,
        List<MealLogItemResponse> items) {

    public static MealLogResponse from(MealLog log) {
        return new MealLogResponse(
                log.getId(),
                log.getLoggedAt(),
                log.getMealSlot().value(),
                log.getTotalGl(),
                log.getNotes(),
                log.getItems().stream().map(MealLogItemResponse::from).toList());
    }
}
