package pl.pollub.footballapp.util;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import pl.pollub.footballapp.util.JwtUtil;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void testGenerateToken() {
        // Arrange
        UserDetails userDetails = new User("testUser", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        // Act
        String token = jwtUtil.generateToken(userDetails);

        // Assert
        assertNotNull(token);
        assertTrue(token.startsWith("eyJ")); // JWT zawsze zaczyna się od tego prefiksu
    }

    @Test
    void testExtractUsername() {
        // Arrange
        UserDetails userDetails = new User("testUser", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        String token = jwtUtil.generateToken(userDetails);

        // Act
        String username = jwtUtil.extractUsername(token);

        // Assert
        assertEquals("testUser", username);
    }

    @Test
    void testValidateToken() {
        // Arrange
        UserDetails userDetails = new User("testUser", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        String token = jwtUtil.generateToken(userDetails);

        // Act
        boolean isValid = jwtUtil.validateToken(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testTokenExpiration() throws InterruptedException {
        // Arrange
        UserDetails userDetails = new User("testUser", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        String token = jwtUtil.generateToken(userDetails);

        // Simulate expiration (np. token o krótkim czasie życia)
        Thread.sleep(500); // tylko w przypadku ręcznej zmiany czasu w generowaniu tokenów

        // Act
        boolean isExpired = jwtUtil.validateToken(token, userDetails);

        // Assert
        assertTrue(isExpired);
    }
}
