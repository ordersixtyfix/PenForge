package org.penforge.backend.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.penforge.backend.common.GenericResponse;
import org.penforge.backend.user.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    public LoginSuccessHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        UserDto userDto = (UserDto) authentication.getPrincipal();
        GenericResponse<Object> genericResponse = new GenericResponse<>().setCode(200);

        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(genericResponse));
    }
}