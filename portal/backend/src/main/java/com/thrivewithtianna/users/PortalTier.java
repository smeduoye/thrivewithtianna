package com.thrivewithtianna.users;

/**
 * Access tier persisted as lowercase strings (see V1 check constraint).
 */
public enum PortalTier {
    FULL("full"),
    LITE("lite"),
    NONE("none");

    private final String value;

    PortalTier(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static PortalTier fromValue(String value) {
        for (PortalTier tier : values()) {
            if (tier.value.equals(value)) {
                return tier;
            }
        }
        throw new IllegalArgumentException("Unknown portal tier: " + value);
    }
}
