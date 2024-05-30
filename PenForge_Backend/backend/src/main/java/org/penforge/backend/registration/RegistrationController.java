package org.penforge.backend.registration;

import lombok.AllArgsConstructor;
import org.penforge.backend.common.GenericResponse;
import org.penforge.backend.user.AppUserLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping(path = "api/v1/registration")
public class RegistrationController {
    private final RegistrationService registrationService;
    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    @PostMapping(consumes = {"multipart/form-data"})
    public GenericResponse<String> register(@RequestParam("firstName") String firstName,
                                            @RequestParam("lastName") String lastName,
                                            @RequestParam("password") String password,
                                            @RequestParam("email") String email,
                                            @RequestParam("appUserLevel") String appUserLevelStr,
                                            @RequestParam("profilePicture") MultipartFile profilePicture) {
        try {
            logger.info("Received registration request for email: {}", email);
            AppUserLevel appUserLevel = AppUserLevel.valueOf(appUserLevelStr.toUpperCase());
            RegistrationRequest request = new RegistrationRequest(firstName, lastName, password, email, appUserLevel, profilePicture);
            registrationService.register(request);
            return new GenericResponse<String>().setCode(200).setData("CREATED");
        } catch (Exception e) {
            logger.error("Error in registration: ", e);
            return new GenericResponse<String>().setCode(400).setData("CANNOT CREATED");
        }
    }
}
