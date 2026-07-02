package com.thrivewithtianna.users;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_e164")
    private String phoneE164;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String role = Role.CLIENT.name();

    @Column(nullable = false)
    private String status = UserStatus.PENDING.value();

    @Column(name = "portal_tier", nullable = false)
    private String portalTier = PortalTier.FULL.value();

    private String programme;

    @Column(name = "cohort_id")
    private UUID cohortId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> goals = new HashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "contact_prefs", nullable = false)
    private Map<String, Object> contactPrefs = new HashMap<>();

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "onboarded_at")
    private Instant onboardedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AppUser() {
    }

    public static AppUser createLocal(String email, String firstName, String lastName, String passwordHash) {
        AppUser user = new AppUser();
        user.id = UUID.randomUUID();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.passwordHash = passwordHash;
        user.role = Role.CLIENT.name();
        user.status = UserStatus.PENDING.value();
        user.portalTier = PortalTier.FULL.value();
        return user;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneE164() {
        return phoneE164;
    }

    public void setPhoneE164(String phoneE164) {
        this.phoneE164 = phoneE164;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return Role.valueOf(role);
    }

    public void setRole(Role role) {
        this.role = role.name();
    }

    public UserStatus getStatus() {
        return UserStatus.fromValue(status);
    }

    public void setStatus(UserStatus status) {
        this.status = status.value();
    }

    public PortalTier getPortalTier() {
        return PortalTier.fromValue(portalTier);
    }

    public void setPortalTier(PortalTier portalTier) {
        this.portalTier = portalTier.value();
    }

    public String getProgramme() {
        return programme;
    }

    public void setProgramme(String programme) {
        this.programme = programme;
    }

    public UUID getCohortId() {
        return cohortId;
    }

    public void setCohortId(UUID cohortId) {
        this.cohortId = cohortId;
    }

    public Map<String, Object> getGoals() {
        return goals;
    }

    public void setGoals(Map<String, Object> goals) {
        this.goals = goals == null ? new HashMap<>() : goals;
    }

    public Map<String, Object> getContactPrefs() {
        return contactPrefs;
    }

    public void setContactPrefs(Map<String, Object> contactPrefs) {
        this.contactPrefs = contactPrefs == null ? new HashMap<>() : contactPrefs;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Instant getOnboardedAt() {
        return onboardedAt;
    }

    public void setOnboardedAt(Instant onboardedAt) {
        this.onboardedAt = onboardedAt;
    }

    public boolean isOnboarded() {
        return onboardedAt != null;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
