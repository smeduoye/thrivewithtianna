package com.thrivewithtianna.coach;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.auth.AuthenticatedUser;
import com.thrivewithtianna.auth.CurrentUser;
import com.thrivewithtianna.dashboard.DashboardService;
import com.thrivewithtianna.messaging.Message;
import com.thrivewithtianna.messaging.MessageResponse;
import com.thrivewithtianna.messaging.MessageService;
import com.thrivewithtianna.messaging.SendMessageRequest;
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
    private final DashboardService dashboardService;
    private final MessageService messageService;

    public AdminUserController(
            UserService userService,
            DashboardService dashboardService,
            MessageService messageService) {
        this.userService = userService;
        this.dashboardService = dashboardService;
        this.messageService = messageService;
    }

    @GetMapping
    public List<UserProfileResponse> list() {
        return userService.listAll();
    }

    @GetMapping("/{id}")
    public ClientDetailResponse detail(@PathVariable UUID id) {
        return new ClientDetailResponse(
                UserProfileResponse.from(userService.require(id)),
                dashboardService.getDashboard(id),
                messageService.unreadFromClient(id));
    }

    @GetMapping("/{id}/messages")
    public List<MessageResponse> messages(@PathVariable UUID id) {
        return messageService.openThread(id, Message.ROLE_COACH);
    }

    @PostMapping("/{id}/messages")
    public MessageResponse sendMessage(
            @PathVariable UUID id,
            @CurrentUser AuthenticatedUser principal,
            @Valid @RequestBody SendMessageRequest request) {
        return messageService.sendAsCoach(id, principal.id(), request.body());
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
