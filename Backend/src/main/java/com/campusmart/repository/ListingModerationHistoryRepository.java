package com.campusmart.repository;

import com.campusmart.model.entity.ListingModerationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ListingModerationHistoryRepository extends JpaRepository<ListingModerationHistory, UUID> {

    Page<ListingModerationHistory> findByListing_IdOrderByActionAtDesc(UUID listingId, Pageable pageable);

    Page<ListingModerationHistory> findByAdminUser_IdOrderByActionAtDesc(UUID adminUserId, Pageable pageable);
}

