package pl.pollub.footballapp.service;

import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.Notification;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
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
}
