package com.campusmart.api.dto;

import com.campusmart.model.enums.ListingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request body for an admin moderation action on a listing.
 */
public class ModerationActionRequest {

    @NotNull(message = "New status is required")
    private ListingStatus newStatus;

    @NotBlank(message = "Reason is required")
    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    private String reason;

    public ModerationActionRequest() {}

    public ModerationActionRequest(ListingStatus newStatus, String reason) {
        this.newStatus = newStatus;
        this.reason = reason;
    }

    public ListingStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ListingStatus newStatus) { this.newStatus = newStatus; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

