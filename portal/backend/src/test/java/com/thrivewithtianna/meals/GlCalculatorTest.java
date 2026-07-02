package com.thrivewithtianna.meals;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class GlCalculatorTest {

    @Test
    void calculatesGlForKnownFood() {
        // Apple: GI 38, 150g with 11.8g carbs/100g → 17.7g carbs → GL ≈ 6.73
        BigDecimal carbs = GlCalculator.carbsForGrams(new BigDecimal("11.8"), new BigDecimal("150"));
        BigDecimal gl = GlCalculator.calculateGl(38, carbs);

        assertThat(carbs).isEqualByComparingTo("17.70");
        assertThat(gl).isEqualByComparingTo("6.73");
    }

    @Test
    void zeroGiReturnsZeroGl() {
        BigDecimal gl = GlCalculator.calculateGl(0, new BigDecimal("20"));
        assertThat(gl).isEqualByComparingTo("0.00");
    }
}
