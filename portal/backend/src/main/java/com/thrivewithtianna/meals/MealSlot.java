package com.thrivewithtianna.meals;

public enum MealSlot {
    BREAKFAST("breakfast"),
    LUNCH("lunch"),
    DINNER("dinner"),
    SNACK("snack");

    private final String value;

    MealSlot(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static MealSlot fromValue(String value) {
        for (MealSlot slot : values()) {
            if (slot.value.equalsIgnoreCase(value)) {
                return slot;
            }
        }
        throw new IllegalArgumentException("Unknown meal slot: " + value);
    }
}
