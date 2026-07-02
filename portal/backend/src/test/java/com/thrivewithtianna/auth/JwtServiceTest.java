package com.thrivewithtianna.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;

import org.junit.jupiter.api.Test;

import com.thrivewithtianna.users.AppUser;

import io.jsonwebtoken.JwtException;

class JwtServiceTest {

    private JwtService service(String secret) {
        JwtProperties props = new JwtProperties();
        props.setSecret(secret);
        props.setExpiration(Duration.ofHours(1));
        return new JwtService(props);
    }

    private AppUser user() {
        return AppUser.createLocal("client@example.com", "Ada", "Lovelace", "hash");
    }

    @Test
    void issuedTokenRoundTripsToPrincipal() {
        JwtService jwt = service("a-short-secret");
        AppUser user = user();

        String token = jwt.issue(user);
        AuthenticatedUser principal = jwt.parse(token);

        assertThat(principal.id()).isEqualTo(user.getId());
        assertThat(principal.email()).isEqualTo("client@example.com");
        assertThat(principal.role()).isEqualTo("CLIENT");
    }

    @Test
    void tokenSignedWithDifferentSecretIsRejected() {
        String token = service("secret-one").issue(user());

        assertThatThrownBy(() -> service("secret-two").parse(token))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void tamperedTokenIsRejected() {
        JwtService jwt = service("a-short-secret");
        String token = jwt.issue(user());
        String tampered = token.substring(0, token.length() - 2) + (token.endsWith("a") ? "bb" : "aa");

        assertThatThrownBy(() -> jwt.parse(tampered))
                .isInstanceOf(RuntimeException.class);
    }
}
