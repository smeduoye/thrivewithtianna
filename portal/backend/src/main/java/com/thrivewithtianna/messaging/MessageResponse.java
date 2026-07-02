package com.thrivewithtianna.messaging;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID senderId,
        String authorRole,
        String channel,
        String body,
        boolean read,
        Instant createdAt) {

    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSenderId(),
                message.getAuthorRole(),
                message.getChannel(),
                message.getBody(),
                message.getReadAt() != null,
                message.getCreatedAt());
    }
}
