package org.penforge.backend.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.penforge.backend.common.Base;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserDto extends Base {


    private String firstName;

    private String lastName;
    private String email;
    private AppUserRole appUserRole;

    private AppUserLevel appUserLevel;


}
