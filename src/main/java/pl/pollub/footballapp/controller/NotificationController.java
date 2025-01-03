package pl.pollub.footballapp.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Notification;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.UserRepository;
import pl.pollub.footballapp.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

//    @GetMapping("/unread/{userId}")
//    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
//        return notificationService.getNotifications(userId);
//    }

    @GetMapping("/unread/{username}")
    public List<Notification> getUnreadNotificationsByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationService.getNotifications(user.getId());
    }


    @PostMapping("/markAsRead/{id}")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

//    @PostMapping("/create")
//    @PreAuthorize("hasRole('ADMIN')")
//    public void createNotification(@RequestParam String title, @RequestParam String message) {
//        notificationService.createNotificationForAll(title, message);
//    }


    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public void createNotification(@RequestBody Notification notification) {
        notificationService.createNotificationForRoles(
                notification.getTitle(),
                notification.getMessage(),
                notification.getRoles()
        );
    }
}
