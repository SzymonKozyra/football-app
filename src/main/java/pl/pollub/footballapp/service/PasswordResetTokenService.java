package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pl.pollub.footballapp.model.PasswordResetToken;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {
    private PasswordResetTokenRepository tokenRepository;
    private UserRepository userRepository;
    @Autowired
    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }





    public String createToken(User user) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
        user.setResettingPassword(true);
        userRepository.save(user);
        tokenRepository.save(passwordResetToken);
        return token;
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> passwordResetToken = tokenRepository.findByToken(token);

        return passwordResetToken.isPresent() &&
                passwordResetToken.get().getExpiryDate().isAfter(LocalDateTime.now());
    }

    public User getUserByToken(String token) {
        Optional<PasswordResetToken> passwordResetToken = tokenRepository.findByToken(token);

        if (passwordResetToken.isPresent() && passwordResetToken.get().getExpiryDate().isAfter(LocalDateTime.now())) {
            return passwordResetToken.get().getUser();
        }

        return null;
    }
}
