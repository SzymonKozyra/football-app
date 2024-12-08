package pl.pollub.footballapp.service;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.UserRepository;
import pl.pollub.footballapp.util.JwtUtil;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    public UserServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setUsername("testuser");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");

        userService.registerUser(user);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        User user = new User();
        user.setEmail("test@example.com");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> userService.registerUser(user));
        assertEquals("Email already in use", exception.getMessage());
    }

    @Test
    void testFindByUsername_Success() {
        User user = new User();
        user.setUsername("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        User foundUser = userService.loadUserByUsername("testuser");
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void testFindByUsername_NotFound() {
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());

        Exception exception = assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("unknownuser"));
        assertEquals("User not found with username: unknownuser", exception.getMessage());
    }
    @Test
    void testLoginUser_Success() {
        // Przygotowanie danych
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser"); // Ustawienie nazwy użytkownika
        String encodedPassword = new BCryptPasswordEncoder().encode("password");
        user.setPassword(encodedPassword);
        user.setRole(User.Role.ROLE_USER); // Ustawienie roli użytkownika

        // Mockowanie repozytorium
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", encodedPassword)).thenReturn(true);

        // Mockowanie `loadUserByUsername`
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user)); // Mock dla loadUserByUsername

        // Mockowanie generowania tokenu JWT
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        // Wywołanie metody
        Map<String, String> response = userService.loginUser(new User("test@example.com", "password"));

        // Assercje
        assertEquals("test@example.com", response.get("email"));
        assertEquals("jwt-token", response.get("token"));
        assertEquals("ROLE_USER", response.get("role")); // Sprawdzenie roli w odpowiedzi
    }



    @Test
    void testLoginUser_InvalidPassword() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encoded-password")).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> userService.loginUser(new User("test@example.com", "wrongpassword")));
        assertEquals("Invalid email or password", exception.getMessage());
    }
}
