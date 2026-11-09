package com.campusmart.security.jwt;

import com.campusmart.model.entity.User;
import com.campusmart.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public JwtUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildUserDetails(user);
    }

    public UserDetails loadUserById(String userId) {
        User user = userRepository.findById(java.util.UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        String authority = "ROLE_" + user.getRole().name(); // ROLE_USER or ROLE_ADMIN
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "", // password not needed for JWT validation
                Collections.singletonList(new SimpleGrantedAuthority(authority))
        );
    }
}
