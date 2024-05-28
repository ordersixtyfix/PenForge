package org.penforge.backend.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.penforge.backend.login.LoginSuccessHandler;
import org.penforge.backend.user.UserDto;
import org.penforge.backend.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.penforge.backend.user.AppUserRole.SUPER_USER;
import static org.penforge.backend.user.AppUserRole.USER;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig {

    private final UserService userService;
    private final LoginSuccessHandler loginSuccessHandler;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        return provider;
    }

    @Bean
    AuthenticationManager getAuthenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        configuration.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {
        return http

                .csrf(csrf->csrf.disable())
                .cors(withDefaults())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/registration")).permitAll();
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/login")).permitAll();
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/forgot-password/**")).permitAll();
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/logout")).permitAll();
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/find-target")).permitAll();
                    auth.requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/pentest-templates")).permitAll();
                    auth.anyRequest().authenticated();




                })
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .formLogin(form->form

                        .successHandler(loginSuccessHandler)
                        .permitAll()

                )
                .build();


    }



    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {


        return new SimpleUrlAuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

                UserDto userDto = userService.getUserByEmail(authentication.getName());


                Map<String, Object> jsonResponse = new HashMap<>();
                response.setContentType("application/json");
                jsonResponse.put("statusCode", HttpServletResponse.SC_OK);
                jsonResponse.put("user", userDto);


                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(response.getWriter(), jsonResponse);
            }
        };
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new SimpleUrlAuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {


                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");


                Map<String, Object> jsonResponse = new HashMap<>();
                jsonResponse.put("statusCode", HttpServletResponse.SC_BAD_REQUEST);


                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(response.getWriter(), jsonResponse);
            }
        };
    }




}