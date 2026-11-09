package com.campusmart.repository;

import com.campusmart.model.entity.ListingImage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingImageRepository extends JpaRepository<ListingImage, UUID> {
    List<ListingImage> findByListing_IdOrderByDisplayOrderAsc(UUID listingId);
    void deleteByListing_Id(UUID listingId);
}

