package com.campusmart.service;

import com.campusmart.api.dto.AdminListingSummary;
import com.campusmart.api.dto.ModerationActionRequest;
import com.campusmart.api.dto.ModerationActionResponse;
import com.campusmart.api.dto.ModerationHistoryEntry;
import com.campusmart.model.entity.Listing;
import com.campusmart.model.entity.ListingModerationHistory;
import com.campusmart.model.entity.User;
import com.campusmart.model.enums.ListingStatus;
import com.campusmart.repository.ListingModerationHistoryRepository;
import com.campusmart.repository.ListingRepository;
import com.campusmart.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * Service for administrative listing moderation actions.
 * Enforces valid status transitions and records an audit trail.
 */
@Service
public class ListingModerationService {

    /**
     * Valid moderation transitions an admin may perform.
     * Admins can deactivate active/draft listings and reactivate deactivated ones.
     */
    private static final Set<String> VALID_TRANSITIONS = Set.of(
            "ACTIVE->DEACTIVATED",
            "DRAFT->DEACTIVATED",
            "DEACTIVATED->ACTIVE"
    );

    private final ListingRepository listingRepository;
    private final ListingModerationHistoryRepository moderationHistoryRepository;
    private final UserRepository userRepository;

    public ListingModerationService(ListingRepository listingRepository,
                                     ListingModerationHistoryRepository moderationHistoryRepository,
                                     UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.moderationHistoryRepository = moderationHistoryRepository;
        this.userRepository = userRepository;
    }

    /**
     * Search all listings with optional status filter. Admins can see all listings
     * including soft-deleted ones.
     */
    @Transactional(readOnly = true)
    public Page<AdminListingSummary> searchListings(ListingStatus status, Boolean deleted, Pageable pageable) {
        Specification<Listing> spec = Specification.where(null);

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (deleted != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("deleted"), deleted));
        }

        return listingRepository.findAll(spec, pageable)
                .map(AdminListingSummary::fromEntity);
    }

    /**
     * Get a single listing by ID. Admins can view any listing regardless of status.
     */
    @Transactional(readOnly = true)
    public AdminListingSummary getListingById(UUID listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));
        return AdminListingSummary.fromEntity(listing);
    }

    /**
     * Perform a moderation action: change listing status and persist an audit entry.
     *
     * @param listingId ID of the listing to moderate
     * @param request   desired new status and reason
     * @param adminId   UUID of the admin performing the action
     * @return response with old/new status and timestamp
     * @throws IllegalArgumentException if listing or admin not found
     * @throws IllegalStateException    if the status transition is invalid
     */
    @Transactional
    public ModerationActionResponse moderate(UUID listingId, ModerationActionRequest request, UUID adminId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + adminId));

        ListingStatus oldStatus = listing.getStatus();
        ListingStatus newStatus = request.getNewStatus();

        // Validate transition
        String transitionKey = oldStatus.name() + "->" + newStatus.name();
        if (!VALID_TRANSITIONS.contains(transitionKey)) {
            throw new IllegalStateException(
                    "Invalid status transition: " + oldStatus + " -> " + newStatus
                            + ". Allowed transitions: " + VALID_TRANSITIONS);
        }

        // Update listing status
        listing.setStatus(newStatus);
        listingRepository.save(listing);

        // Persist audit record
        ListingModerationHistory history = new ListingModerationHistory();
        history.setListing(listing);
        history.setAdminUser(admin);
        history.setPreviousStatus(oldStatus.name());
        history.setNewStatus(newStatus.name());
        history.setReason(request.getReason());
        history.setActionAt(Instant.now());
        moderationHistoryRepository.save(history);

        return new ModerationActionResponse(
                listing.getId(),
                oldStatus.name(),
                newStatus.name(),
                adminId,
                request.getReason(),
                history.getActionAt()
        );
    }

    /**
     * Retrieve moderation history for a specific listing.
     */
    @Transactional(readOnly = true)
    public Page<ModerationHistoryEntry> getHistoryForListing(UUID listingId, Pageable pageable) {
        // Verify listing exists
        if (!listingRepository.existsById(listingId)) {
            throw new IllegalArgumentException("Listing not found: " + listingId);
        }
        return moderationHistoryRepository.findByListing_IdOrderByActionAtDesc(listingId, pageable)
                .map(ModerationHistoryEntry::fromEntity);
    }
}

