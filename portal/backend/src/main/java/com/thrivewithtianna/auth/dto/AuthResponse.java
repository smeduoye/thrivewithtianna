package com.thrivewithtianna.auth.dto;

import com.thrivewithtianna.users.UserProfileResponse;

/**
 * Returned by register/login: the bearer token, its lifetime, and the profile
 * so the SPA can hydrate without an extra /api/me round-trip.
 */
public record AuthResponse(
        String token,
        String tokenType,
        long expiresInSeconds,
        UserProfileResponse user) {

    public static AuthResponse of(String token, long expiresInSeconds, UserProfileResponse user) {
        return new AuthResponse(token, "Bearer", expiresInSeconds, user);
    }
}
