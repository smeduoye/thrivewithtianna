package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.util.UUID;

public record MealLogItemResponse(
        UUID id,
        UUID foodItemId,
        String name,
        BigDecimal quantity,
        String unit,
        BigDecimal carbsG,
        BigDecimal gl,
        boolean estimated) {

    public static MealLogItemResponse from(MealLogItem item) {
        return new MealLogItemResponse(
                item.getId(),
                item.getFoodItemId(),
                item.getFreeTextName(),
                item.getQuantity(),
                item.getUnit(),
                item.getCarbsG(),
                item.getGl(),
                item.isEstimated());
    }
}
