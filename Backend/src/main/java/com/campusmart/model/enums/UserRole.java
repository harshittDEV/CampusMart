package com.campusmart.model.enums;

/**
 * Simple role enumeration for authorization checks.
 * The values map directly to Spring Security authorities (ROLE_USER, ROLE_ADMIN).
 */
public enum UserRole {
    USER,
    ADMIN
}

