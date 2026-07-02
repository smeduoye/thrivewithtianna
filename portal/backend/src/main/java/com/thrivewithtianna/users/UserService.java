package com.thrivewithtianna.users;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.common.error.ConflictException;
import com.thrivewithtianna.common.error.ResourceNotFoundException;

@Service
public class UserService {

    private final AppUserRepository repository;

    public UserService(AppUserRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public AppUser require(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(UserProfileResponse::from)
                .toList();
    }

    @Transactional
    public UserProfileResponse completeOnboarding(UUID userId, OnboardingRequest request) {
        if (!request.consentAccepted()) {
            throw new IllegalArgumentException("Consent must be accepted to complete onboarding.");
        }
        AppUser user = require(userId);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhoneE164(request.phoneE164());
        user.setGoals(request.goals());
        user.setContactPrefs(request.contactPrefs());
        if (!user.isOnboarded()) {
            user.setOnboardedAt(Instant.now());
        }
        if (user.getStatus() == UserStatus.PENDING) {
            user.setStatus(UserStatus.TRIALING);
        }
        return UserProfileResponse.from(repository.save(user));
    }

    @Transactional
    public UserProfileResponse invite(String email, String firstName, String lastName, Role role, PortalTier tier) {
        String normalized = email.trim().toLowerCase();
        if (repository.existsByEmailIgnoreCase(normalized)) {
            throw new ConflictException("A user with that email already exists.");
        }
        AppUser user = AppUser.createLocal(normalized, firstName.trim(), lastName.trim(), null);
        user.setRole(role);
        user.setPortalTier(tier);
        return UserProfileResponse.from(repository.save(user));
    }
}
