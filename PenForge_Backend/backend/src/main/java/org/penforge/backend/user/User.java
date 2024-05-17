package org.penforge.backend.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.penforge.backend.common.Base;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@NoArgsConstructor
@Document(collection = "Users")
@TypeAlias("User")
@SuperBuilder
public class User extends Base {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private AppUserRole appUserRole;

    private AppUserLevel appUserLevel;

    private String resetToken;



}
