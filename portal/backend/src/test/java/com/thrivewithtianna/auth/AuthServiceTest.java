package com.thrivewithtianna.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.thrivewithtianna.auth.dto.AuthResponse;
import com.thrivewithtianna.auth.dto.LoginRequest;
import com.thrivewithtianna.auth.dto.RegisterRequest;
import com.thrivewithtianna.common.error.AuthenticationException;
import com.thrivewithtianna.common.error.ConflictException;
import com.thrivewithtianna.users.AppUser;
import com.thrivewithtianna.users.AppUserRepository;

class AuthServiceTest {

    private AppUserRepository repository;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(AppUserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        JwtProperties props = new JwtProperties();
        props.setSecret("test-secret");
        props.setExpiration(Duration.ofHours(1));
        authService = new AuthService(repository, passwordEncoder, new JwtService(props));
    }

    @Test
    void registerCreatesUserAndReturnsToken() {
        when(repository.existsByEmailIgnoreCase("new@example.com")).thenReturn(false);
        when(repository.save(any(AppUser.class))).thenAnswer(inv -> inv.getArgument(0));

        AuthResponse response = authService.register(
                new RegisterRequest("New@Example.com", "password123", "Ada", "Lovelace"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.user().email()).isEqualTo("new@example.com");
        assertThat(response.user().onboarded()).isFalse();
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(repository.existsByEmailIgnoreCase("dupe@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("dupe@example.com", "password123", "Ada", "Lovelace")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void loginSucceedsWithCorrectPassword() {
        AppUser user = AppUser.createLocal(
                "client@example.com", "Ada", "Lovelace", passwordEncoder.encode("password123"));
        when(repository.findByEmailIgnoreCase("client@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(new LoginRequest("client@example.com", "password123"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("client@example.com");
    }

    @Test
    void loginFailsWithWrongPassword() {
        AppUser user = AppUser.createLocal(
                "client@example.com", "Ada", "Lovelace", passwordEncoder.encode("password123"));
        when(repository.findByEmailIgnoreCase("client@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("client@example.com", "wrong-password")))
                .isInstanceOf(AuthenticationException.class);
    }

    @Test
    void loginFailsForUnknownEmail() {
        when(repository.findByEmailIgnoreCase("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("ghost@example.com", "password123")))
                .isInstanceOf(AuthenticationException.class);
    }
}
