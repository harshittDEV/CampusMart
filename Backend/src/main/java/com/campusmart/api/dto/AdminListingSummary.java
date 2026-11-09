package com.campusmart.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Summary DTO for admin listing views. Includes seller info and moderation-relevant fields.
 */
public class AdminListingSummary {

    private UUID id;
    private String title;
    private BigDecimal price;
    private String currencyCode;
    private String status;
    private String condition;
    private UUID sellerId;
    private String sellerEmail;
    private UUID institutionId;
    private UUID categoryId;
    private boolean deleted;
    private Instant createdAt;
    private Instant updatedAt;

    public AdminListingSummary() {}

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public UUID getSellerId() { return sellerId; }
    public void setSellerId(UUID sellerId) { this.sellerId = sellerId; }

    public String getSellerEmail() { return sellerEmail; }
    public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }

    public UUID getInstitutionId() { return institutionId; }
    public void setInstitutionId(UUID institutionId) { this.institutionId = institutionId; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    /**
     * Factory method to build from a Listing entity.
     */
    public static AdminListingSummary fromEntity(com.campusmart.model.entity.Listing listing) {
        AdminListingSummary dto = new AdminListingSummary();
        dto.setId(listing.getId());
        dto.setTitle(listing.getTitle());
        dto.setPrice(listing.getPrice());
        dto.setCurrencyCode(listing.getCurrencyCode());
        dto.setStatus(listing.getStatus().name());
        dto.setCondition(listing.getCondition().name());
        dto.setSellerId(listing.getSeller().getId());
        dto.setSellerEmail(listing.getSeller().getEmail());
        dto.setInstitutionId(listing.getInstitution().getId());
        dto.setCategoryId(listing.getCategory().getId());
        dto.setDeleted(listing.isDeleted());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());
        return dto;
    }
}

