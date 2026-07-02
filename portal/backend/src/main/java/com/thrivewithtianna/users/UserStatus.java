package com.thrivewithtianna.users;

/**
 * Lifecycle states persisted as lowercase strings (see V1 check constraint).
 */
public enum UserStatus {
    PENDING("pending"),
    TRIALING("trialing"),
    ACTIVE("active"),
    PAST_DUE("past_due"),
    SUSPENDED("suspended"),
    ARCHIVED("archived");

    private final String value;

    UserStatus(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static UserStatus fromValue(String value) {
        for (UserStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown user status: " + value);
    }
}
