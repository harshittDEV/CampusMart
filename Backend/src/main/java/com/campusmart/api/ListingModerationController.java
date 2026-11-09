package com.campusmart.api;

import com.campusmart.api.dto.AdminListingSummary;
import com.campusmart.api.dto.ModerationActionRequest;
import com.campusmart.api.dto.ModerationActionResponse;
import com.campusmart.api.dto.ModerationHistoryEntry;
import com.campusmart.model.entity.User;
import com.campusmart.model.enums.ListingStatus;
import com.campusmart.repository.UserRepository;
import com.campusmart.service.ListingModerationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Administrative endpoints for listing moderation.
 * All endpoints require ROLE_ADMIN authority.
 */
@RestController
@RequestMapping("/api/v1/admin/listings")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class ListingModerationController {

    private final ListingModerationService moderationService;
    private final UserRepository userRepository;

    public ListingModerationController(ListingModerationService moderationService,
                                        UserRepository userRepository) {
        this.moderationService = moderationService;
        this.userRepository = userRepository;
    }

    /**
     * Search listings with optional filters. Admins see all listings.
     *
     * @param status  optional status filter (DRAFT, ACTIVE, SOLD, DEACTIVATED)
     * @param deleted optional soft-delete filter
     * @param pageable pagination parameters (page, size, sort)
     */
    @GetMapping
    public ResponseEntity<Page<AdminListingSummary>> searchListings(
            @RequestParam(name = "status", required = false) ListingStatus status,
            @RequestParam(name = "deleted", required = false) Boolean deleted,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<AdminListingSummary> results = moderationService.searchListings(status, deleted, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Get a single listing by ID with full details visible to admin.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminListingSummary> getListingById(@PathVariable("id") UUID id) {
        AdminListingSummary listing = moderationService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    /**
     * Perform a moderation action on a listing (e.g., deactivate or reactivate).
     */
    @PatchMapping("/{id}/moderate")
    public ResponseEntity<ModerationActionResponse> moderate(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ModerationActionRequest request,
            Authentication authentication) {
        UUID adminId = resolveAdminId(authentication);
        ModerationActionResponse response = moderationService.moderate(id, request, adminId);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve the moderation audit history for a specific listing.
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<Page<ModerationHistoryEntry>> getHistory(
            @PathVariable("id") UUID id,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ModerationHistoryEntry> history = moderationService.getHistoryForListing(id, pageable);
        return ResponseEntity.ok(history);
    }

    /**
     * Resolve the admin's UUID from the Spring Security Authentication principal.
     */
    private UUID resolveAdminId(Authentication authentication) {
        String email = authentication.getName();
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated admin user not found"));
        return admin.getId();
    }
}

