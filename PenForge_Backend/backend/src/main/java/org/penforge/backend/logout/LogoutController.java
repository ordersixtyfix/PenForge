package org.penforge.backend.logout;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.penforge.backend.common.GenericResponse;
@RestController
@RequestMapping("/api/v1")
public class LogoutController {

    @PostMapping("/logout")
    public GenericResponse<String> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }
        return new GenericResponse<String>().setCode(200).setData("Oturum başarıyla kapatıldı");
    }
}