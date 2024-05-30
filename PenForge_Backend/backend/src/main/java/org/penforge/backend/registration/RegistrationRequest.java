package org.penforge.backend.registration;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.penforge.backend.user.AppUserLevel;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationRequest {
    private final String firstName;
    private final String lastName;
    private final String password;
    private final String email;
    private final AppUserLevel appUserLevel;
    private final MultipartFile profilePicture;
}
