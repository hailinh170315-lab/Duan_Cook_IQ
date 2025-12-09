package com.cook_iq.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@EnableScheduling
public class CookIqApplication {

    public static void main(String[] args) {
        SpringApplication.run(CookIqApplication.class, args);
    }

    @Bean
    CommandLineRunner testProps(@Value("${app.jwt.secret}") String secret) {
        return args -> System.out.println("JWT Secret = " + secret);
    }
}