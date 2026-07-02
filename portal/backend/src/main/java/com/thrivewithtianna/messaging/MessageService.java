package com.thrivewithtianna.messaging;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thrivewithtianna.users.UserService;

@Service
public class MessageService {

    private final MessageRepository repository;
    private final UserService userService;

    public MessageService(MessageRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    /**
     * Returns the client's thread and marks the other party's messages as read
     * for whoever is opening it.
     */
    @Transactional
    public List<MessageResponse> openThread(UUID clientId, String readerRole) {
        userService.require(clientId);
        String otherRole = Message.ROLE_CLIENT.equals(readerRole) ? Message.ROLE_COACH : Message.ROLE_CLIENT;
        repository.markThreadRead(clientId, otherRole, Instant.now());
        return repository.findByClientIdOrderByCreatedAtAsc(clientId).stream()
                .map(MessageResponse::from)
                .toList();
    }

    @Transactional
    public MessageResponse sendAsClient(UUID clientId, String body) {
        Message message = Message.create(clientId, clientId, Message.ROLE_CLIENT, body.trim());
        return MessageResponse.from(repository.save(message));
    }

    @Transactional
    public MessageResponse sendAsCoach(UUID clientId, UUID coachId, String body) {
        userService.require(clientId);
        Message message = Message.create(clientId, coachId, Message.ROLE_COACH, body.trim());
        return MessageResponse.from(repository.save(message));
    }

    /** Unread coach messages waiting for the client (drives the client's badge). */
    @Transactional(readOnly = true)
    public long unreadForClient(UUID clientId) {
        return repository.countByClientIdAndAuthorRoleAndReadAtIsNull(clientId, Message.ROLE_COACH);
    }

    /** Unread client messages waiting for the coach (drives the roster badge). */
    @Transactional(readOnly = true)
    public long unreadFromClient(UUID clientId) {
        return repository.countByClientIdAndAuthorRoleAndReadAtIsNull(clientId, Message.ROLE_CLIENT);
    }
}
