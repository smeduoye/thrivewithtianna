package com.thrivewithtianna.users;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Client-facing view of an {@link AppUser}. Never exposes password_hash.
 */
public record UserProfileResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phoneE164,
        String role,
        String status,
        String portalTier,
        String programme,
        Map<String, Object> goals,
        Map<String, Object> contactPrefs,
        boolean onboarded,
        Instant onboardedAt,
        Instant createdAt) {

    public static UserProfileResponse from(AppUser user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneE164(),
                user.getRole().name(),
                user.getStatus().value(),
                user.getPortalTier().value(),
                user.getProgramme(),
                user.getGoals(),
                user.getContactPrefs(),
                user.isOnboarded(),
                user.getOnboardedAt(),
                user.getCreatedAt());
    }
}
