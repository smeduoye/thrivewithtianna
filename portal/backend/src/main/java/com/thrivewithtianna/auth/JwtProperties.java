package com.thrivewithtianna.auth;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT signing configuration. The secret is shared with the deploy .env
 * (JWT_SECRET) and hashed to a 256-bit key in {@link JwtService}.
 */
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /** HMAC secret; any length — hashed to 256 bits before signing. */
    private String secret = "change-me-in-production";

    /** Access token lifetime. */
    private Duration expiration = Duration.ofDays(7);

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Duration getExpiration() {
        return expiration;
    }

    public void setExpiration(Duration expiration) {
        this.expiration = expiration;
    }
}
