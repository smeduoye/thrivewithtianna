package com.thrivewithtianna.users;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * MVP onboarding payload. Mandatory field set is provisional pending U-16;
 * goals and contact preferences are free-form JSON maps for now.
 */
public record OnboardingRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @Size(max = 20) String phoneE164,
        Map<String, Object> goals,
        Map<String, Object> contactPrefs,
        boolean consentAccepted) {
}
