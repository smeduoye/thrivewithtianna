package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateMealRequest(
        @NotNull Instant loggedAt,
        @NotBlank String mealSlot,
        String notes,
        @NotEmpty @Valid List<MealItemRequest> items) {

    public record MealItemRequest(
            UUID foodItemId,
            String freeTextName,
            @NotNull @Positive BigDecimal quantity,
            String unit) {
    }
}
