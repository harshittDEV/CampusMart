package com.campusmart.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {
    /** Secret key used for HS256 signing. Must be at least 256 bits (32 bytes) in production. */
    private String secret;
    /** Issuer claim value. */
    private String issuer = "campusmart-backend";
    /** Access token lifetime in minutes. */
    private long accessTokenExpirationMinutes = 15;
    /** Refresh token lifetime in days. */
    private long refreshTokenExpirationDays = 30;

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public long getAccessTokenExpirationMinutes() { return accessTokenExpirationMinutes; }
    public void setAccessTokenExpirationMinutes(long accessTokenExpirationMinutes) { this.accessTokenExpirationMinutes = accessTokenExpirationMinutes; }
    public long getRefreshTokenExpirationDays() { return refreshTokenExpirationDays; }
    public void setRefreshTokenExpirationDays(long refreshTokenExpirationDays) { this.refreshTokenExpirationDays = refreshTokenExpirationDays; }
}
