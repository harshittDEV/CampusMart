package com.campusmart.api.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Response body returned after a moderation action is performed.
 */
public class ModerationActionResponse {

    private UUID listingId;
    private String oldStatus;
    private String newStatus;
    private UUID adminId;
    private String reason;
    private Instant timestamp;

    public ModerationActionResponse() {}

    public ModerationActionResponse(UUID listingId, String oldStatus, String newStatus,
                                     UUID adminId, String reason, Instant timestamp) {
        this.listingId = listingId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.adminId = adminId;
        this.reason = reason;
        this.timestamp = timestamp;
    }

    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public UUID getAdminId() { return adminId; }
    public void setAdminId(UUID adminId) { this.adminId = adminId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

