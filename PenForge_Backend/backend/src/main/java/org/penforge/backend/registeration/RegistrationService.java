package org.penforge.backend.registeration;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.penforge.backend.security.validator.EmailValidator;
import org.penforge.backend.user.AppUserRole;
import org.penforge.backend.user.User;
import org.penforge.backend.user.UserRepository;
import org.penforge.backend.user.UserService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserService userService;

    public User register(RegistrationRequest request) {
        try {

            if (request.getFirstName().isEmpty() ||
                    request.getLastName().isEmpty()||
                    request.getPassword().isEmpty() ||
                    request.getEmail().isEmpty()) {
                throw new IllegalArgumentException("All fields in the RegistrationRequest must be provided.");
            }

            return userService.signUpUser(User.builder()
                    .id(UUID.randomUUID().toString())
                    .lastName(request.getLastName())
                    .firstName(request.getFirstName())
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .appUserLevel(request.getAppUserLevel())
                    .appUserRole(AppUserRole.USER).build());

        } catch (Exception e) {

            throw new IllegalStateException("User cannot created");
        }
    }
}