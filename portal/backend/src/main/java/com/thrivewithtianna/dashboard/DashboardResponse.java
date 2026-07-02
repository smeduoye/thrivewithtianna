package com.thrivewithtianna.dashboard;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.thrivewithtianna.meals.MealLogResponse;

public record DashboardResponse(
        String primaryGoal,
        int glTargetLow,
        int glTargetHigh,
        BigDecimal todayGl,
        int todayMealsLogged,
        int mealLoggingStreak,
        BigDecimal lastWeightKg,
        Instant lastWeightAt,
        BigDecimal lastSleepHours,
        Short lastSleepQuality,
        String suggestedAction,
        List<MealLogResponse> recentMeals,
        BigDecimal weekAvgGl,
        BigDecimal weekWeightChangeKg) {
}
