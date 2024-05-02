package org.penforge.backend.ftp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AttackController {

    @Autowired //AttackService sınıfının bir örneğini enjekte eder. Bu, AttackController içinde kullanılan saldırı metotlarını çağırmak için gerekli.
    private AttackService attackService;

    @GetMapping("/ftpBruteforce") // get isteklerini url ile eşleştiriyormuş.
    public ResponseEntity<String> ftpBruteforce(@RequestParam String ip) {
        return ResponseEntity.ok(attackService.performFtpBruteforce(ip));
    }
}