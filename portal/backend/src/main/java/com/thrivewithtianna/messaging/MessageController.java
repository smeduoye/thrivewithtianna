package com.thrivewithtianna.messaging;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thrivewithtianna.auth.AuthenticatedUser;
import com.thrivewithtianna.auth.CurrentUser;

import jakarta.validation.Valid;

/**
 * Client-facing messaging: each client has one thread with their coach.
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<MessageResponse> thread(@CurrentUser AuthenticatedUser principal) {
        return messageService.openThread(principal.id(), Message.ROLE_CLIENT);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(@CurrentUser AuthenticatedUser principal) {
        return Map.of("count", messageService.unreadForClient(principal.id()));
    }

    @PostMapping
    public MessageResponse send(
            @CurrentUser AuthenticatedUser principal,
            @Valid @RequestBody SendMessageRequest request) {
        return messageService.sendAsClient(principal.id(), request.body());
    }
}
