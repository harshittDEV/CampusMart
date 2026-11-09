package com.campusmart.service;

import com.campusmart.api.dto.ModerationActionRequest;
import com.campusmart.api.dto.ModerationActionResponse;
import com.campusmart.api.dto.AdminListingSummary;
import com.campusmart.api.dto.ModerationHistoryEntry;
import com.campusmart.model.entity.*;
import com.campusmart.model.enums.ListingStatus;
import com.campusmart.model.enums.ProductCondition;
import com.campusmart.model.enums.UserRole;
import com.campusmart.repository.ListingModerationHistoryRepository;
import com.campusmart.repository.ListingRepository;
import com.campusmart.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ListingModerationServiceTest {

    @Mock
    private ListingRepository listingRepository;

    @Mock
    private ListingModerationHistoryRepository moderationHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ListingModerationService moderationService;

    private User adminUser;
    private User sellerUser;
    private Institution institution;
    private Category category;
    private Listing activeListing;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setEmail("admin@university.edu");
        adminUser.setRole(UserRole.ADMIN);

        sellerUser = new User();
        sellerUser.setId(UUID.randomUUID());
        sellerUser.setEmail("seller@university.edu");
        sellerUser.setRole(UserRole.USER);

        institution = new Institution();
        institution.setId(UUID.randomUUID());

        category = new Category();
        category.setId(UUID.randomUUID());

        activeListing = createListing(ListingStatus.ACTIVE);
    }

    private Listing createListing(ListingStatus status) {
        Listing listing = new Listing();
        listing.setId(UUID.randomUUID());
        listing.setTitle("Test Textbook");
        listing.setDescription("A used textbook");
        listing.setPrice(new BigDecimal("299.99"));
        listing.setCurrencyCode("INR");
        listing.setCondition(ProductCondition.GOOD);
        listing.setStatus(status);
        listing.setSeller(sellerUser);
        listing.setInstitution(institution);
        listing.setCategory(category);
        return listing;
    }

    // --- moderate() tests ---

    @Test
    void moderate_deactivateActiveListing_succeeds() {
        when(listingRepository.findById(activeListing.getId())).thenReturn(Optional.of(activeListing));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
        when(moderationHistoryRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(listingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Policy violation");
        ModerationActionResponse response = moderationService.moderate(activeListing.getId(), request, adminUser.getId());

        assertEquals("ACTIVE", response.getOldStatus());
        assertEquals("DEACTIVATED", response.getNewStatus());
        assertEquals(adminUser.getId(), response.getAdminId());
        assertEquals("Policy violation", response.getReason());
        assertNotNull(response.getTimestamp());

        // Verify listing status was updated
        assertEquals(ListingStatus.DEACTIVATED, activeListing.getStatus());

        // Verify audit record saved
        ArgumentCaptor<ListingModerationHistory> historyCaptor = ArgumentCaptor.forClass(ListingModerationHistory.class);
        verify(moderationHistoryRepository).save(historyCaptor.capture());
        ListingModerationHistory saved = historyCaptor.getValue();
        assertEquals("ACTIVE", saved.getPreviousStatus());
        assertEquals("DEACTIVATED", saved.getNewStatus());
        assertEquals("Policy violation", saved.getReason());
    }

    @Test
    void moderate_reactivateDeactivatedListing_succeeds() {
        Listing deactivated = createListing(ListingStatus.DEACTIVATED);
        when(listingRepository.findById(deactivated.getId())).thenReturn(Optional.of(deactivated));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
        when(moderationHistoryRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(listingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.ACTIVE, "Appeal approved");
        ModerationActionResponse response = moderationService.moderate(deactivated.getId(), request, adminUser.getId());

        assertEquals("DEACTIVATED", response.getOldStatus());
        assertEquals("ACTIVE", response.getNewStatus());
        assertEquals(ListingStatus.ACTIVE, deactivated.getStatus());
    }

    @Test
    void moderate_deactivateDraftListing_succeeds() {
        Listing draft = createListing(ListingStatus.DRAFT);
        when(listingRepository.findById(draft.getId())).thenReturn(Optional.of(draft));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
        when(moderationHistoryRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(listingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Spam detected");
        ModerationActionResponse response = moderationService.moderate(draft.getId(), request, adminUser.getId());

        assertEquals("DRAFT", response.getOldStatus());
        assertEquals("DEACTIVATED", response.getNewStatus());
    }

    @Test
    void moderate_invalidTransition_activeToSold_throws() {
        when(listingRepository.findById(activeListing.getId())).thenReturn(Optional.of(activeListing));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.SOLD, "Not allowed");
        assertThrows(IllegalStateException.class,
                () -> moderationService.moderate(activeListing.getId(), request, adminUser.getId()));

        // Listing status should remain unchanged
        assertEquals(ListingStatus.ACTIVE, activeListing.getStatus());
        verify(moderationHistoryRepository, never()).save(any());
    }

    @Test
    void moderate_invalidTransition_soldToActive_throws() {
        Listing sold = createListing(ListingStatus.SOLD);
        when(listingRepository.findById(sold.getId())).thenReturn(Optional.of(sold));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.ACTIVE, "Not allowed");
        assertThrows(IllegalStateException.class,
                () -> moderationService.moderate(sold.getId(), request, adminUser.getId()));
    }

    @Test
    void moderate_sameStatus_throws() {
        when(listingRepository.findById(activeListing.getId())).thenReturn(Optional.of(activeListing));
        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.ACTIVE, "No change");
        assertThrows(IllegalStateException.class,
                () -> moderationService.moderate(activeListing.getId(), request, adminUser.getId()));
    }

    @Test
    void moderate_listingNotFound_throws() {
        UUID unknownId = UUID.randomUUID();
        when(listingRepository.findById(unknownId)).thenReturn(Optional.empty());

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Reason");
        assertThrows(IllegalArgumentException.class,
                () -> moderationService.moderate(unknownId, request, adminUser.getId()));
    }

    @Test
    void moderate_adminNotFound_throws() {
        UUID unknownAdminId = UUID.randomUUID();
        when(listingRepository.findById(activeListing.getId())).thenReturn(Optional.of(activeListing));
        when(userRepository.findById(unknownAdminId)).thenReturn(Optional.empty());

        ModerationActionRequest request = new ModerationActionRequest(ListingStatus.DEACTIVATED, "Reason");
        assertThrows(IllegalArgumentException.class,
                () -> moderationService.moderate(activeListing.getId(), request, unknownAdminId));
    }

    // --- getListingById() tests ---

    @Test
    void getListingById_found_returnsDto() {
        when(listingRepository.findById(activeListing.getId())).thenReturn(Optional.of(activeListing));

        AdminListingSummary dto = moderationService.getListingById(activeListing.getId());

        assertEquals(activeListing.getId(), dto.getId());
        assertEquals("Test Textbook", dto.getTitle());
        assertEquals("ACTIVE", dto.getStatus());
        assertEquals(sellerUser.getEmail(), dto.getSellerEmail());
    }

    @Test
    void getListingById_notFound_throws() {
        UUID unknownId = UUID.randomUUID();
        when(listingRepository.findById(unknownId)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> moderationService.getListingById(unknownId));
    }

    // --- searchListings() tests ---

    @Test
    @SuppressWarnings("unchecked")
    void searchListings_noFilters_returnsAll() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Listing> page = new PageImpl<>(List.of(activeListing));
        when(listingRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        Page<AdminListingSummary> result = moderationService.searchListings(null, null, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(activeListing.getId(), result.getContent().get(0).getId());
    }

    // --- getHistoryForListing() tests ---

    @Test
    void getHistoryForListing_listingNotFound_throws() {
        UUID unknownId = UUID.randomUUID();
        when(listingRepository.existsById(unknownId)).thenReturn(false);
        assertThrows(IllegalArgumentException.class,
                () -> moderationService.getHistoryForListing(unknownId, PageRequest.of(0, 20)));
    }

    @Test
    void getHistoryForListing_emptyHistory_returnsEmptyPage() {
        when(listingRepository.existsById(activeListing.getId())).thenReturn(true);
        when(moderationHistoryRepository.findByListing_IdOrderByActionAtDesc(
                eq(activeListing.getId()), any(Pageable.class)))
                .thenReturn(Page.empty());

        Page<ModerationHistoryEntry> result = moderationService.getHistoryForListing(
                activeListing.getId(), PageRequest.of(0, 20));

        assertEquals(0, result.getTotalElements());
    }
}

