package com.campusmart.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final JwtProperties properties;
    private final SecretKey secretKey;

    public JwtUtil(JwtProperties properties) {
        this.properties = properties;
        if (properties.getSecret() == null || properties.getSecret().isBlank()) {
            throw new IllegalStateException("JWT secret must be configured via environment variable");
        }
        this.secretKey = Keys.hmacShaKeyFor(properties.getSecret().getBytes());
    }

    public String generateAccessToken(UUID userId) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(properties.getAccessTokenExpirationMinutes() * 60L);
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuer(properties.getIssuer())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UUID userId) {
        // Refresh token is a high‑entropy random UUID string; we will hash it before persisting.
        // The raw token string is returned to caller.
        return UUID.randomUUID().toString();
    }

    public Claims validateToken(String token) {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
        return jws.getBody();
    }
}
