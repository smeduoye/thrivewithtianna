package com.thrivewithtianna.meals;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "meal_log")
public class MealLog {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "logged_at", nullable = false)
    private Instant loggedAt;

    @Column(name = "meal_slot", nullable = false)
    private String mealSlot;

    @Column(name = "total_gl", nullable = false)
    private BigDecimal totalGl = BigDecimal.ZERO;

    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "mealLog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<MealLogItem> items = new ArrayList<>();

    protected MealLog() {
    }

    public static MealLog create(UUID userId, Instant loggedAt, MealSlot slot, String notes) {
        MealLog log = new MealLog();
        log.id = UUID.randomUUID();
        log.userId = userId;
        log.loggedAt = loggedAt;
        log.mealSlot = slot.value();
        log.notes = notes;
        return log;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public void addItem(MealLogItem item) {
        item.setMealLog(this);
        items.add(item);
        recalculateTotal();
    }

    public void recalculateTotal() {
        totalGl = items.stream()
                .map(MealLogItem::getGl)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public Instant getLoggedAt() {
        return loggedAt;
    }

    public MealSlot getMealSlot() {
        return MealSlot.fromValue(mealSlot);
    }

    public BigDecimal getTotalGl() {
        return totalGl;
    }

    public String getNotes() {
        return notes;
    }

    public List<MealLogItem> getItems() {
        return items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
