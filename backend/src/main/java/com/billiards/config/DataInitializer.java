package com.billiards.config;

import com.billiards.model.User;
import com.billiards.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("hieu")) {
            User user = User.builder()
                    .username("hieu")
                    .password(passwordEncoder.encode("123"))
                    .build();
            userRepository.save(user);
            log.info("Default user 'hieu' created successfully");
        } else {
            log.info("Default user 'hieu' already exists");
        }
    }
}
