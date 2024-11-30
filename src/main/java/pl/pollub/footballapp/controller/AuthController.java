package pl.pollub.footballapp.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import pl.pollub.footballapp.util.JwtUtil;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private UserService userService;
    private UserRepository userRepository;
    private JwtUtil jwtUtil;
    private UserDetailsService userDetailsService;
    @Autowired
    public AuthController(UserService userService, UserRepository userRepository, JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already in use");
        }

        user.setRole(User.Role.ROLE_USER);

        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }



    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty() || !userService.checkPassword(loginRequest.getPassword(), userOptional.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
        User user = userOptional.get();
        if (user.isResettingPassword()) {
            return ResponseEntity.status(403).body("Please complete the password reset process before logging in.");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);
        Map<String, String> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("token", jwtToken);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUsername;

        if (principal instanceof UserDetails) {
            currentUsername = ((UserDetails) principal).getUsername();
        } else {
            return ResponseEntity.status(404).body("User not found");
        }

        Optional<User> userOptional = userRepository.findByUsername(currentUsername);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        userRepository.delete(userOptional.get());

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Account deleted successfully");
    }

    @GetMapping("/check-admin")
    public ResponseEntity<Boolean> checkIfAdminExists() {
        boolean adminExists = userRepository.existsByRole(User.Role.ROLE_ADMIN);
        return ResponseEntity.ok(adminExists);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {
        if (userRepository.existsByRole(User.Role.ROLE_ADMIN)) {
            return ResponseEntity.badRequest().body("Admin account already exists.");
        }
        user.setRole(User.Role.ROLE_ADMIN);
        userService.registerUser(user);
        return ResponseEntity.ok("Admin account created successfully.");
    }


    @GetMapping("/users/email/{email}")
    public ResponseEntity<?> getUserIdByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByUsername(email);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.get().getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("/get-email")
    public ResponseEntity<?> getUserEmailFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring("Bearer ".length());
            String email = jwtUtil.extractUsername(jwt);  // Assuming `extractUsername` returns email from "sub"
            return ResponseEntity.ok(email);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}