package org.penforge.backend.login;

import org.penforge.backend.common.GenericResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1")
public class LogoutController {

    @PostMapping("/logout")
    public GenericResponse<String> logout() {
        try {
            // Spring Security oturumunu temizle
            SecurityContextHolder.clearContext();
            return new GenericResponse<String>().setCode(200);
        } catch (Exception e) {
            return new GenericResponse<String>().setCode(500);
        }
    }
}
