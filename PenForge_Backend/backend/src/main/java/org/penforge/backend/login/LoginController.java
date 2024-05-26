package org.penforge.backend.login;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.penforge.backend.common.GenericResponse;
import org.penforge.backend.user.UserDto;
import org.penforge.backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1")
@Slf4j
public class LoginController {


    private final AuthenticationManager authentication;
    private final UserService userService;


    @PostMapping("/login")
    public GenericResponse<UserDto> login(@RequestBody LoginRequest authRequest) {
        try {
            Authentication authObject = authentication.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authObject);
        } catch (BadCredentialsException e) {
            // Handle the authentication failure here
            log.error("Authentication failed for user: {}", authRequest.getEmail());
            return new GenericResponse<UserDto>().setCode(401);
        }
        UserDto userDto = userService.getUserByEmail(authRequest.getEmail());
        return new GenericResponse<UserDto>().setCode(200).setData(userDto);
    }

}