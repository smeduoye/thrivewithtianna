package com.thrivewithtianna.coach;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.users.PortalTier;
import com.thrivewithtianna.users.Role;
import com.thrivewithtianna.users.UserProfileResponse;
import com.thrivewithtianna.users.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Coach/Admin roster APIs. Access enforced in SecurityConfig
 * (/api/admin/** requires COACH or ADMIN).
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserProfileResponse> list() {
        return userService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfileResponse invite(@Valid @RequestBody InviteRequest request) {
        Role role = request.role() == null ? Role.CLIENT : Role.valueOf(request.role().toUpperCase());
        PortalTier tier = request.portalTier() == null
                ? PortalTier.FULL
                : PortalTier.fromValue(request.portalTier().toLowerCase());
        return userService.invite(request.email(), request.firstName(), request.lastName(), role, tier);
    }

    public record InviteRequest(
            @NotBlank @Email String email,
            @NotBlank String firstName,
            @NotBlank String lastName,
            String role,
            String portalTier) {
    }
}
