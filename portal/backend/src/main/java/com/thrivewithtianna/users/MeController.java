package com.thrivewithtianna.users;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.auth.AuthenticatedUser;
import com.thrivewithtianna.auth.CurrentUser;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class MeController {

    private final UserService userService;

    public MeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserProfileResponse me(@CurrentUser AuthenticatedUser principal) {
        return UserProfileResponse.from(userService.require(principal.id()));
    }

    @PostMapping("/onboarding")
    public UserProfileResponse onboarding(
            @CurrentUser AuthenticatedUser principal,
            @Valid @RequestBody OnboardingRequest request) {
        return userService.completeOnboarding(principal.id(), request);
    }
}
