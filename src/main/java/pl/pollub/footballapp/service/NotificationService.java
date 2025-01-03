package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.Notification;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.NotificationRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void createNotification(String title, String message, User user) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notification.setUser(user);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void createBetNotification(User user, Match match) {
        Notification notification = new Notification();
        notification.setTitle("Zakład postawiony");
        notification.setMessage("Twój zakład na mecz " + match.getHomeTeam().getName() + " vs " + match.getAwayTeam().getName() + " został zapisany.");
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        notification.setUser(user);
        notificationRepository.save(notification);
    }

    public void createNotificationForAll(String title, String message) {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            createNotification(title, message, user);
        }
    }

    public void createNotificationForRoles(String title, String message, List<String> roles) {
        List<User> users = userRepository.findByRoleIn(roles);
        for (User user : users) {
            createNotification(title, message, user);
        }
    }
}
