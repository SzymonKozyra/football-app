package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;
import pl.pollub.footballapp.repository.UserRepository;
import pl.pollub.footballapp.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-moderator")
    public ResponseEntity<?> addModerator(@RequestBody User moderatorRequest) {
        if (userRepository.existsByEmail(moderatorRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User moderator = new User();
        moderator.setEmail(moderatorRequest.getEmail());
        moderator.setPassword(userService.encodePassword(moderatorRequest.getPassword()));
        moderator.setUsername(moderatorRequest.getUsername());  // Add the username
        moderator.setRole(User.Role.ROLE_MODERATOR);

        userRepository.save(moderator);
        return ResponseEntity.ok("Moderator added successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-admin")
    public ResponseEntity<?> addAdmin(@RequestBody User adminRequest) {
        if (userRepository.existsByEmail(adminRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User admin = new User();
        admin.setEmail(adminRequest.getEmail());
        admin.setPassword(userService.encodePassword(adminRequest.getPassword()));
        admin.setUsername(adminRequest.getUsername());  // Add the username
        admin.setRole(User.Role.ROLE_ADMIN);

        userRepository.save(admin);
        return ResponseEntity.ok("Moderator added successfully");
    }


    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete-user/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();

        passwordResetTokenRepository.deleteByUserId(user.getId());

        userRepository.deleteByEmail(email);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/change-password/{email}")
    public ResponseEntity<?> changePassword(@PathVariable String email, @RequestBody String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        user.setPassword(userService.encodePassword(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}
