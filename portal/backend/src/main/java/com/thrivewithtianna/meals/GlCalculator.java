package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Glycemic load: GL = (GI × available carbohydrate in grams) / 100.
 */
public final class GlCalculator {

    private GlCalculator() {
    }

    public static BigDecimal carbsForGrams(BigDecimal carbsPer100g, BigDecimal quantityG) {
        return carbsPer100g
                .multiply(quantityG)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateGl(int gi, BigDecimal carbsG) {
        if (gi <= 0 || carbsG.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.valueOf(gi)
                .multiply(carbsG)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public static BigDecimal calculateGl(FoodItem food, BigDecimal quantityG) {
        BigDecimal carbs = carbsForGrams(food.getCarbsPer100g(), quantityG);
        return calculateGl(food.getGi(), carbs);
    }
}
