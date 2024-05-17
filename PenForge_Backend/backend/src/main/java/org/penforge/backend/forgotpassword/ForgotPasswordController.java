package org.penforge.backend.forgotpassword;

import org.penforge.backend.common.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/request")
    public GenericResponse<String> requestReset(@RequestParam String email) {
        boolean result = forgotPasswordService.sendResetToken(email);
        return new GenericResponse<String>()
                .setCode(result ? 200 : 404)
                .setData(result ? "Reset token sent to email" : "Email not found");
    }

    @PostMapping("/validate-token")
    public GenericResponse<String> validateToken(@RequestParam String token) {
        boolean result = forgotPasswordService.validateResetToken(token);
        return new GenericResponse<String>()
                .setCode(result ? 200 : 400)
                .setData(result ? "Valid token" : "Invalid token");
    }

    @PostMapping("/reset-password")
    public GenericResponse<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        boolean result = forgotPasswordService.resetPassword(token, newPassword);
        return new GenericResponse<String>()
                .setCode(result ? 200 : 400)
                .setData(result ? "Password reset successful" : "Invalid token");
    }
}