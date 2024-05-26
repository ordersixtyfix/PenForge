package org.penforge.backend.registeration;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.penforge.backend.user.AppUserLevel;

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


}
