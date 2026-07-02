package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "meal_log_item")
public class MealLogItem {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_log_id", nullable = false)
    private MealLog mealLog;

    @Column(name = "food_item_id")
    private UUID foodItemId;

    @Column(name = "free_text_name")
    private String freeTextName;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit = "g";

    @Column(name = "carbs_g")
    private BigDecimal carbsG;

    @Column(nullable = false)
    private BigDecimal gl = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean estimated;

    protected MealLogItem() {
    }

    public static MealLogItem fromFood(FoodItem food, BigDecimal quantityG) {
        MealLogItem item = new MealLogItem();
        item.id = UUID.randomUUID();
        item.foodItemId = food.getId();
        item.freeTextName = food.getName();
        item.quantity = quantityG;
        item.unit = "g";
        item.carbsG = GlCalculator.carbsForGrams(food.getCarbsPer100g(), quantityG);
        item.gl = GlCalculator.calculateGl(food, quantityG);
        item.estimated = false;
        return item;
    }

    public static MealLogItem freeText(String name, BigDecimal quantity, String unit) {
        MealLogItem item = new MealLogItem();
        item.id = UUID.randomUUID();
        item.freeTextName = name;
        item.quantity = quantity;
        item.unit = unit;
        item.gl = BigDecimal.ZERO;
        item.estimated = true;
        return item;
    }

    void setMealLog(MealLog mealLog) {
        this.mealLog = mealLog;
    }

    public UUID getId() {
        return id;
    }

    public UUID getFoodItemId() {
        return foodItemId;
    }

    public String getFreeTextName() {
        return freeTextName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public BigDecimal getCarbsG() {
        return carbsG;
    }

    public BigDecimal getGl() {
        return gl;
    }

    public boolean isEstimated() {
        return estimated;
    }
}
