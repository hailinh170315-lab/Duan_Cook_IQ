package com.cook_iq.auth.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private Long jwtExpirationMs; // in milliseconds

    private Key signingKey;

    // ✅ Tạo key một lần khi khởi động app
    @PostConstruct
    public void init() {
        signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ Tạo JWT token
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Trích xuất username từ token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ Kiểm tra token có hợp lệ không
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // ✅ Kiểm tra token hết hạn chưa
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Trích xuất ngày hết hạn
    public Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    // ===================================================================
    // HÀM MỚI ĐƯỢC BỔ SUNG
    // ===================================================================

    /**
     * Tạo JWT token từ userId và danh sách roles (dùng cho admin login).
     * Hàm này linh hoạt hơn, không phụ thuộc vào UserDetails.
     *
     * @param subjectEmail email của người dùng (ví dụ: "admin@gmail.com" hoặc email từ MongoDB).
     * @param roles  Danh sách vai trò (ví dụ: List.of("ROLE_ADMIN")).
     * @return Chuỗi JWT.
     */
    // in JwtService
    public String createToken(String subjectEmail, List<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        Claims claims = Jwts.claims().setSubject(subjectEmail);
        claims.put("roles", roles);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    //Dùng để kiểm tra quyền user hoặc admin.
    public List<String> extractRoles(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (List<String>) claims.get("roles");
    }

    public String generateTokenWithClaims(UserDetails userDetails, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        Claims claims = Jwts.claims().setSubject(userDetails.getUsername());
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    //Refresh token
    public String generateRefreshToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs * 1); // ví dụ 7 ngày

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    //kiểm tra role trong token
    public boolean hasRole(String token, String role) {
        List<String> roles = extractRoles(token);
        return roles.contains(role);
    }
}
