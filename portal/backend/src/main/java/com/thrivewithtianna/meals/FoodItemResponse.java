package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.util.UUID;

public record FoodItemResponse(
        UUID id,
        String name,
        String category,
        int gi,
        BigDecimal carbsPer100g,
        BigDecimal defaultServingG,
        BigDecimal glPerDefaultServing) {

    public static FoodItemResponse from(FoodItem food) {
        BigDecimal gl = GlCalculator.calculateGl(food, food.getDefaultServingG());
        return new FoodItemResponse(
                food.getId(),
                food.getName(),
                food.getCategory(),
                food.getGi(),
                food.getCarbsPer100g(),
                food.getDefaultServingG(),
                gl);
    }
}
