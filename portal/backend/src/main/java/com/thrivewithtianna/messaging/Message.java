package com.thrivewithtianna.messaging;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * A single message in a client's coach thread. {@code clientId} identifies the
 * thread; {@code senderId} is who authored it. Phase 1 is human-authored so
 * {@code authorRole} is either {@code client} or {@code coach}.
 */
@Entity
@Table(name = "message")
public class Message {

    public static final String ROLE_CLIENT = "client";
    public static final String ROLE_COACH = "coach";

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "sender_id")
    private UUID senderId;

    @Column(name = "author_role", nullable = false)
    private String authorRole;

    @Column(nullable = false)
    private String channel;

    @Column(nullable = false)
    private String body;

    @Column(name = "read_at")
    private Instant readAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Message() {
    }

    public static Message create(UUID clientId, UUID senderId, String authorRole, String body) {
        Message message = new Message();
        message.id = UUID.randomUUID();
        message.clientId = clientId;
        message.senderId = senderId;
        message.authorRole = authorRole;
        message.channel = "portal";
        message.body = body;
        return message;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getClientId() {
        return clientId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public String getChannel() {
        return channel;
    }

    public String getBody() {
        return body;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void markRead(Instant when) {
        if (readAt == null) {
            readAt = when;
        }
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
