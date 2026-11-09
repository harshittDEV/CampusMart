package com.campusmart.api.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO representing a single moderation audit entry.
 */
public class ModerationHistoryEntry {

    private UUID id;
    private UUID listingId;
    private String listingTitle;
    private UUID adminId;
    private String adminEmail;
    private String previousStatus;
    private String newStatus;
    private String reason;
    private Instant actionAt;

    public ModerationHistoryEntry() {}

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }

    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }

    public UUID getAdminId() { return adminId; }
    public void setAdminId(UUID adminId) { this.adminId = adminId; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Instant getActionAt() { return actionAt; }
    public void setActionAt(Instant actionAt) { this.actionAt = actionAt; }

    public static ModerationHistoryEntry fromEntity(com.campusmart.model.entity.ListingModerationHistory h) {
        ModerationHistoryEntry dto = new ModerationHistoryEntry();
        dto.setId(h.getId());
        dto.setListingId(h.getListing().getId());
        dto.setListingTitle(h.getListing().getTitle());
        dto.setAdminId(h.getAdminUser().getId());
        dto.setAdminEmail(h.getAdminUser().getEmail());
        dto.setPreviousStatus(h.getPreviousStatus());
        dto.setNewStatus(h.getNewStatus());
        dto.setReason(h.getReason());
        dto.setActionAt(h.getActionAt());
        return dto;
    }
}

