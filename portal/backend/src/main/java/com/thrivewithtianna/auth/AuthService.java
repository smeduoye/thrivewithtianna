package com.thrivewithtianna.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.auth.dto.AuthResponse;
import com.thrivewithtianna.auth.dto.LoginRequest;
import com.thrivewithtianna.auth.dto.RegisterRequest;
import com.thrivewithtianna.common.error.AuthenticationException;
import com.thrivewithtianna.common.error.ConflictException;
import com.thrivewithtianna.users.AppUser;
import com.thrivewithtianna.users.AppUserRepository;
import com.thrivewithtianna.users.UserProfileResponse;
import com.thrivewithtianna.users.UserStatus;

@Service
public class AuthService {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account with that email already exists.");
        }
        AppUser user = AppUser.createLocal(
                email,
                request.firstName().trim(),
                request.lastName().trim(),
                passwordEncoder.encode(request.password()));
        AppUser saved = repository.save(user);
        return buildResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        AppUser user = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password."));

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password.");
        }
        if (user.getStatus() == UserStatus.SUSPENDED || user.getStatus() == UserStatus.ARCHIVED) {
            throw new AuthenticationException("This account is not active. Contact your coach.");
        }
        return buildResponse(user);
    }

    private AuthResponse buildResponse(AppUser user) {
        String token = jwtService.issue(user);
        return AuthResponse.of(token, jwtService.getExpirationSeconds(), UserProfileResponse.from(user));
    }
}
