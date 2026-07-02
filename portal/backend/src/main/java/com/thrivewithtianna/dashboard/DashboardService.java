package com.thrivewithtianna.dashboard;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.meals.MealLog;
import com.thrivewithtianna.meals.MealLogRepository;
import com.thrivewithtianna.meals.MealLogResponse;
import com.thrivewithtianna.metrics.SleepLogRepository;
import com.thrivewithtianna.metrics.WeightLog;
import com.thrivewithtianna.metrics.WeightLogRepository;
import com.thrivewithtianna.users.AppUser;
import com.thrivewithtianna.users.UserService;

@Service
public class DashboardService {

    private static final int DEFAULT_GL_LOW = 45;
    private static final int DEFAULT_GL_HIGH = 55;

    private final UserService userService;
    private final MealLogRepository mealRepository;
    private final WeightLogRepository weightRepository;
    private final SleepLogRepository sleepRepository;

    public DashboardService(
            UserService userService,
            MealLogRepository mealRepository,
            WeightLogRepository weightRepository,
            SleepLogRepository sleepRepository) {
        this.userService = userService;
        this.mealRepository = mealRepository;
        this.weightRepository = weightRepository;
        this.sleepRepository = sleepRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(UUID userId) {
        AppUser user = userService.require(userId);
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate weekStart = today.minusDays(6);

        Instant todayStart = today.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant tomorrowStart = today.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant weekStartInstant = weekStart.atStartOfDay().toInstant(ZoneOffset.UTC);

        List<MealLog> todayMeals = mealRepository
                .findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, todayStart, tomorrowStart);
        List<MealLog> weekMeals = mealRepository
                .findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, weekStartInstant, tomorrowStart);

        BigDecimal todayGl = todayMeals.stream()
                .map(MealLog::getTotalGl)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal weekGl = weekMeals.stream()
                .map(MealLog::getTotalGl)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Set<LocalDate> weekDatesWithMeals = new HashSet<>();
        for (MealLog meal : weekMeals) {
            weekDatesWithMeals.add(meal.getLoggedAt().atZone(ZoneOffset.UTC).toLocalDate());
        }
        BigDecimal weekAvgGl = weekDatesWithMeals.isEmpty()
                ? BigDecimal.ZERO
                : weekGl.divide(BigDecimal.valueOf(weekDatesWithMeals.size()), 2, RoundingMode.HALF_UP);

        int streak = computeStreak(userId, today);

        var lastWeight = weightRepository.findTopByUserIdOrderByLoggedAtDesc(userId);
        var weekWeights = weightRepository.findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(
                userId, weekStartInstant, tomorrowStart);

        BigDecimal weekWeightChange = null;
        if (weekWeights.size() >= 2) {
            WeightLog newest = weekWeights.get(0);
            WeightLog oldest = weekWeights.get(weekWeights.size() - 1);
            weekWeightChange = newest.getWeightKg().subtract(oldest.getWeightKg()).setScale(2, RoundingMode.HALF_UP);
        }

        var lastSleep = sleepRepository.findTopByUserIdOrderByLogDateDesc(userId);

        Map<String, Object> goals = user.getGoals();
        String primaryGoal = goals.get("primary") != null ? goals.get("primary").toString() : null;
        int glLow = intFromGoals(goals, "glTargetLow", DEFAULT_GL_LOW);
        int glHigh = intFromGoals(goals, "glTargetHigh", DEFAULT_GL_HIGH);

        String suggestedAction = suggestAction(todayMeals.isEmpty(), lastWeight.isEmpty(), lastSleep.isEmpty());

        List<MealLogResponse> recentMeals = todayMeals.stream()
                .limit(3)
                .map(MealLogResponse::from)
                .toList();

        return new DashboardResponse(
                primaryGoal,
                glLow,
                glHigh,
                todayGl,
                todayMeals.size(),
                streak,
                lastWeight.map(WeightLog::getWeightKg).orElse(null),
                lastWeight.map(WeightLog::getLoggedAt).orElse(null),
                lastSleep.map(s -> s.getHours()).orElse(null),
                lastSleep.map(s -> s.getQuality()).orElse(null),
                suggestedAction,
                recentMeals,
                weekAvgGl,
                weekWeightChange);
    }

    private int computeStreak(UUID userId, LocalDate today) {
        int streak = 0;
        LocalDate cursor = today;
        while (true) {
            Instant start = cursor.atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant end = cursor.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            boolean hasMeal = !mealRepository
                    .findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, start, end)
                    .isEmpty();
            if (!hasMeal) {
                break;
            }
            streak++;
            cursor = cursor.minusDays(1);
            if (streak > 365) {
                break;
            }
        }
        return streak;
    }

    private static String suggestAction(boolean noMealsToday, boolean noWeight, boolean noSleep) {
        if (noMealsToday) {
            return "Log your first meal today";
        }
        if (noSleep) {
            return "Log last night's sleep";
        }
        if (noWeight) {
            return "Log your weight to track progress";
        }
        return "You're on track — keep logging";
    }

    private static int intFromGoals(Map<String, Object> goals, String key, int defaultValue) {
        Object value = goals.get(key);
        if (value instanceof Number number) {
            return number.intValue();
        }
        return defaultValue;
    }
}
