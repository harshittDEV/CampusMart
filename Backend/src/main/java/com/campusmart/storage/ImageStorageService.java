package com.campusmart.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for storing listing images.
 * Implementations may store the file locally or in an S3‑compatible bucket.
 */
public interface ImageStorageService {
    /**
     * Store the given file for the supplied listing and user.
     * @param file the uploaded image
     * @param listingId the UUID of the listing
     * @param userId the UUID of the authenticated user (used for ownership checks if needed)
     * @return a URL or identifier that can be persisted in the {@code ListingImage} entity
     * @throws IllegalArgumentException if validation fails (type, size, etc.)
     */
    String store(MultipartFile file, java.util.UUID listingId, java.util.UUID userId);

    /**
     * Delete the stored object identified by the given key.
     */
    void delete(String objectKey);

    /**
     * Return an accessible URL for the stored object.
     * For local storage this may be a static path; for S3 it could be a signed URL.
     */
    String getUrl(String objectKey);
}

