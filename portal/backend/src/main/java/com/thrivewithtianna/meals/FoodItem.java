package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "food_item")
public class FoodItem {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private short gi;

    @Column(name = "carbs_per_100g", nullable = false)
    private BigDecimal carbsPer100g;

    @Column(name = "default_serving_g", nullable = false)
    private BigDecimal defaultServingG;

    @Column(name = "search_name", nullable = false)
    private String searchName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected FoodItem() {
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public int getGi() {
        return gi;
    }

    public BigDecimal getCarbsPer100g() {
        return carbsPer100g;
    }

    public BigDecimal getDefaultServingG() {
        return defaultServingG;
    }

    public String getSearchName() {
        return searchName;
    }
}
