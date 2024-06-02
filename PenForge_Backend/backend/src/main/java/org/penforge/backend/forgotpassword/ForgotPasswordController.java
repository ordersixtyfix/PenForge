package org.penforge.backend.forgotpassword;

import lombok.AllArgsConstructor;
import org.penforge.backend.common.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.penforge.backend.user.*;

@RestController
@RequestMapping("/api/forgot-password")
@AllArgsConstructor
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;


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
    @PutMapping("/update-password")
    public GenericResponse<String> updatePassword(@RequestParam String userId, @RequestParam String newPassword) {
        boolean result = forgotPasswordService.updatePassword(userId, newPassword);
        return new GenericResponse<String>()
                .setCode(result ? 200 : 400)
                .setData(result ? "Password update successful" : "User not found");
    }

    @PutMapping("/update-email")
    public GenericResponse<String> updateEmail(@RequestParam String userId, @RequestParam String newEmail) {
        boolean result = forgotPasswordService.updateEmail(userId, newEmail);
        return new GenericResponse<String>()
                .setCode(result ? 200 : 400)
                .setData(result ? "Email update successful" : "User not found");
    }
}