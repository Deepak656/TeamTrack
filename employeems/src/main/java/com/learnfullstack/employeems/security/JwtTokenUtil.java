package com.learnfullstack.employeems.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey key;

    private final long jwtExpirationMs = 86400000; // 1 day

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // ✅ Generate token from subject (e.g. username or email)
    public String generateToken(String subject) {
        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    // ✅ Extract subject (username/email) from token
    public String getSubject(String token) {
        try {
            JwtParser parser = Jwts.parser()
                    .verifyWith(key)
                    .build();

            Jws<Claims> jwt = parser.parseSignedClaims(token);
            return jwt.getPayload().getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    // ✅ Check if token is valid (signature + expiration)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
