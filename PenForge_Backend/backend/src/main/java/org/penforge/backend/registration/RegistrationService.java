package org.penforge.backend.registration;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.penforge.backend.user.AppUserRole;
import org.penforge.backend.user.User;
import org.penforge.backend.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final GridFsTemplate gridFsTemplate;
    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);

    public User register(RegistrationRequest request) {
        try {
            logger.info("Registering user with email: {}", request.getEmail());

            if (request.getFirstName().isEmpty() ||
                    request.getLastName().isEmpty() ||
                    request.getPassword().isEmpty() ||
                    request.getEmail().isEmpty()) {
                logger.error("All fields must be provided.");
                throw new IllegalArgumentException("All fields in the RegistrationRequest must be provided.");
            }

            // Handle profile picture
            String profilePictureUrl = null;
            if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
                profilePictureUrl = saveProfilePicture(request.getProfilePicture());
                logger.info("Profile picture saved at: {}", profilePictureUrl);
            }

            User user = User.builder()
                    .id(UUID.randomUUID().toString())
                    .lastName(request.getLastName())
                    .firstName(request.getFirstName())
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .appUserLevel(request.getAppUserLevel())
                    .appUserRole(AppUserRole.USER)
                    .profilePictureUrl(profilePictureUrl)
                    .build();

            User registeredUser = userService.signUpUser(user);
            logger.info("User registered successfully with ID: {}", registeredUser.getId());

            return registeredUser;

        } catch (Exception e) {
            logger.error("Error registering user: ", e);
            throw new IllegalStateException("User cannot be created", e);
        }
    }

    private String saveProfilePicture(MultipartFile profilePicture) throws IOException {
        ObjectId fileId = gridFsTemplate.store(profilePicture.getInputStream(), profilePicture.getOriginalFilename(), profilePicture.getContentType());
        return fileId.toString();
    }
}