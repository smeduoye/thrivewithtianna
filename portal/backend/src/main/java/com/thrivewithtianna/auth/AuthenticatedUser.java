package com.thrivewithtianna.auth;

import java.util.UUID;

/**
 * Principal stored in the security context for authenticated requests.
 */
public record AuthenticatedUser(UUID id, String email, String role) {
}
