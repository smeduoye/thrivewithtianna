package com.thrivewithtianna.meals;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.common.error.ResourceNotFoundException;

@Service
public class MealService {

    private final FoodItemRepository foodRepository;
    private final MealLogRepository mealRepository;

    public MealService(FoodItemRepository foodRepository, MealLogRepository mealRepository) {
        this.foodRepository = foodRepository;
        this.mealRepository = mealRepository;
    }

    @Transactional(readOnly = true)
    public List<FoodItemResponse> searchFoods(String term, int limit) {
        String normalized = term == null ? "" : term.trim();
        return foodRepository.search(normalized, PageRequest.of(0, Math.min(limit, 50)))
                .stream()
                .map(FoodItemResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MealLogResponse> listMeals(UUID userId, LocalDate from, LocalDate to) {
        Instant start = from.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant end = to.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        return mealRepository.findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(userId, start, end)
                .stream()
                .map(MealLogResponse::from)
                .toList();
    }

    @Transactional
    public MealLogResponse createMeal(UUID userId, CreateMealRequest request) {
        MealLog log = MealLog.create(
                userId,
                request.loggedAt(),
                MealSlot.fromValue(request.mealSlot()),
                request.notes());

        for (CreateMealRequest.MealItemRequest itemReq : request.items()) {
            MealLogItem item = buildItem(itemReq);
            log.addItem(item);
        }

        return MealLogResponse.from(mealRepository.save(log));
    }

    @Transactional
    public void deleteMeal(UUID userId, UUID mealId) {
        MealLog log = mealRepository.findByIdAndUserId(mealId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found."));
        mealRepository.delete(log);
    }

    private MealLogItem buildItem(CreateMealRequest.MealItemRequest itemReq) {
        if (itemReq.foodItemId() != null) {
            FoodItem food = foodRepository.findById(itemReq.foodItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Food not found: " + itemReq.foodItemId()));
            return MealLogItem.fromFood(food, itemReq.quantity());
        }
        if (itemReq.freeTextName() != null && !itemReq.freeTextName().isBlank()) {
            return MealLogItem.freeText(
                    itemReq.freeTextName().trim(),
                    itemReq.quantity(),
                    itemReq.unit() == null ? "serving" : itemReq.unit());
        }
        throw new IllegalArgumentException("Each item needs foodItemId or freeTextName.");
    }
}
