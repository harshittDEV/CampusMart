package com.campusmart.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Development‑only implementation that stores images on the local filesystem under
 * {@code uploads/listings/<listing-id>/}. The directory is created on demand.
 * This bean is activated when {@code app.image.storage.type=local} (default for dev profile).
 */
@Component
public class LocalFileImageStorageService implements ImageStorageService {

    @Value("${app.image.storage.base-dir:uploads}")
    private String baseDir;

    @Override
    public String store(MultipartFile file, UUID listingId, UUID userId) {
        // Basic validation – type & size are enforced elsewhere in the service layer.
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFilename);
        String objectKey = UUID.randomUUID().toString() + (extension != null ? "." + extension : "");
        Path targetDir = Path.of(baseDir, "listings", listingId.toString());
        try {
            Files.createDirectories(targetDir);
            Path targetFile = targetDir.resolve(objectKey);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
            return targetFile.toString(); // stored path used as imageUrl in DB
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store image", e);
        }
    }

    @Override
    public void delete(String objectKey) {
        try {
            Files.deleteIfExists(Path.of(objectKey));
        } catch (IOException e) {
            // Log and ignore – missing file is not fatal for the API response.
        }
    }

    @Override
    public String getUrl(String objectKey) {
        // In dev we expose a simple file:// URL – the frontend can fetch via the static resource handler.
        return "file://" + objectKey;
    }
}

