package com.thrivewithtianna.meals;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.auth.AuthenticatedUser;
import com.thrivewithtianna.auth.CurrentUser;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping("/foods")
    public List<FoodItemResponse> searchFoods(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "20") int limit) {
        return mealService.searchFoods(search, limit);
    }

    @GetMapping("/meals")
    public List<MealLogResponse> listMeals(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return mealService.listMeals(user.id(), from, to);
    }

    @PostMapping("/meals")
    @ResponseStatus(HttpStatus.CREATED)
    public MealLogResponse createMeal(
            @CurrentUser AuthenticatedUser user,
            @Valid @RequestBody CreateMealRequest request) {
        return mealService.createMeal(user.id(), request);
    }

    @DeleteMapping("/meals/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMeal(@CurrentUser AuthenticatedUser user, @PathVariable UUID id) {
        mealService.deleteMeal(user.id(), id);
    }
}
