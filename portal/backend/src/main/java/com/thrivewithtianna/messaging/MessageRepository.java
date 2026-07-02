package com.thrivewithtianna.messaging;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByClientIdOrderByCreatedAtAsc(UUID clientId);

    long countByClientIdAndAuthorRoleAndReadAtIsNull(UUID clientId, String authorRole);

    @Modifying
    @Query("update Message m set m.readAt = :now "
            + "where m.clientId = :clientId and m.authorRole = :authorRole and m.readAt is null")
    int markThreadRead(
            @Param("clientId") UUID clientId,
            @Param("authorRole") String authorRole,
            @Param("now") Instant now);
}
