package com.cook_iq.auth.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Bật và cấu hình CORS
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/api/auth/**", "/api/draw/**").permitAll()
                                .requestMatchers("/api/blog/public/**").permitAll()
                                .requestMatchers("/api/blog/detail/**").permitAll()
                                // ======= ADMIN ONLY ==========
                                .requestMatchers("/api/blog/approve/**").hasRole("ADMIN")
                                // ======= ANY AUTHENTICATED USER ==========
                                .requestMatchers("/api/blog/create").hasAnyRole("USER", "ADMIN")
                                // Public
                                .requestMatchers("/api/products/**").permitAll() // Xem sản phẩm công khai
                                .requestMatchers("/api/categories/**").permitAll() // Xem danh mục công khai

                                // Admin only
                                .requestMatchers("/api/products/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/categories/admin/**").hasRole("ADMIN")

                                // Blog routes
                                .requestMatchers("/api/blog/public/**").permitAll()
                                .requestMatchers("/api/blog/detail/**").permitAll()
                                .requestMatchers("/api/blog/approve/**").hasRole("ADMIN")
                                .requestMatchers("/api/blog/create").hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/uploads/**").permitAll()
                                .requestMatchers("/api/blog/comment/**").authenticated()

                                .requestMatchers("/api/orders/create", "/api/orders/my-orders").authenticated()
                                .requestMatchers("/api/orders/admin/**").hasRole("ADMIN")

//                        .requestMatchers(HttpMethod.GET, "/").permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://cookiq.io.vn",      // QUAN TRỌNG
                "https://www.cookiq.io.vn"
        ));
        config.setAllowedMethods(List.of("GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}