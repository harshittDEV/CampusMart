package com.campusmart.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "institutions")
public class Institution extends BaseEntity {

    @Column(name = "name", nullable = false)
    @NotBlank
    private String name;

    @Column(name = "code", nullable = false, unique = true)
    @NotBlank
    @Size(max = 50)
    private String code;

    // Store multiple email domains as a PostgreSQL text array; map as a @Column with columnDefinition.
    @Column(name = "email_domains", columnDefinition = "TEXT[]")
    private String[] emailDomains;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String[] getEmailDomains() {
        return emailDomains;
    }

    public void setEmailDomains(String[] emailDomains) {
        this.emailDomains = emailDomains;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
