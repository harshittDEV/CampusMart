package com.campusmart.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import java.util.Objects;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.net.URI;
import java.util.UUID;

/**
 * Production implementation that stores images in an S3‑compatible bucket.
 * Configuration is driven by {@code app.image.storage.*} properties.
 * The bean is activated when {@code app.image.storage.type=s3}.
 */
@Component
public class S3ImageStorageService implements ImageStorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String endpoint; // optional custom endpoint (e.g., MinIO)
    private final Region region;

    public S3ImageStorageService(
            @Value("${app.image.storage.s3.bucket}") String bucket,
            @Value("${app.image.storage.s3.region:us-east-1}") String regionStr,
            @Value("${app.image.storage.s3.endpoint:}") String endpoint) {
        this.bucket = Objects.requireNonNull(bucket, "S3 bucket name must be provided");
        this.region = Region.of(regionStr);
        this.endpoint = StringUtils.hasText(endpoint) ? endpoint : null;

        AwsCredentialsProvider credentialsProvider = EnvironmentVariableCredentialsProvider.create();
        S3ClientBuilder builder = S3Client.builder()
                .region(this.region)
                .credentialsProvider(credentialsProvider);
        if (this.endpoint != null) {
            builder.endpointOverride(URI.create(this.endpoint));
        }
        this.s3Client = builder.build();
    }

    @Override
    public String store(MultipartFile file, UUID listingId, UUID userId) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFilename);
        String objectKey = "listings/" + listingId + "/" + UUID.randomUUID() + (extension != null ? "." + extension : "");
        try {
            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(putReq, RequestBody.fromBytes(file.getBytes()));
            return objectKey;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload image to S3", e);
        }
    }

    @Override
    public void delete(String objectKey) {
        try {
            DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .build();
            s3Client.deleteObject(delReq);
        } catch (S3Exception e) {
            // Log and ignore; missing object is not fatal.
        }
    }

    @Override
    public String getUrl(String objectKey) {
        // Simple public URL construction – assumes bucket is public or appropriate CloudFront is in front.
        if (endpoint != null && endpoint.startsWith("http")) {
            // Custom endpoint (MinIO) – use it as base URL.
            return endpoint.endsWith("/") ? endpoint + objectKey : endpoint + "/" + objectKey;
        }
        return "https://" + bucket + ".s3." + region.id() + ".amazonaws.com/" + objectKey;
    }
}

