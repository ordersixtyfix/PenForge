package org.penforge.backend.forgotpassword;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.penforge.backend.user.User;
import org.penforge.backend.user.UserRepository;


import java.util.Optional;
import java.util.UUID;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public boolean sendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString().substring(0, 4);
            user.setResetToken(token);
            userRepository.save(user);

            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Şifre Sıfırlama İsteği");
            mailMessage.setText("Şifrenizi sıfırlamak için bu kodu kullanın: " + token);

            mailSender.send(mailMessage);

            return true;
        }
        return false;
    }

    public boolean validateResetToken(String token) {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        return userOpt.isPresent();
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            user.setResetToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}