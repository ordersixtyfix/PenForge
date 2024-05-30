package org.penforge.backend.user;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final static String USER_NOT_FOUND_MSG = "user with email %s not found";
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @PostConstruct
    private void postConstruct() {
        User admin = User.builder().lastName("Gul").firstName("Bora").email("admin@admin.com").password("+5%sko7d!")
                .appUserRole(AppUserRole.SUPER_USER).build();

        boolean userExists = userRepository.findByEmail(admin.getEmail()).isPresent();

        if (!userExists) {
            String encodedPassword = bCryptPasswordEncoder.encode(admin.getPassword());
            admin.setPassword(encodedPassword);
            admin.setId(UUID.randomUUID().toString());
            userRepository.save(admin);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> account = userRepository.findByEmail(email);
        if (account.isEmpty()) throw new UsernameNotFoundException("User Not Found");
        return new org.springframework.security.core.userdetails.User(account.get().getEmail(), account.get().getPassword(), AuthorityUtils.createAuthorityList(account.get().getAppUserRole().toString()));
    }

    public User signUpUser(User user) {
        boolean userExists = userRepository.findByEmail(user.getEmail()).isPresent();

        if (userExists) {
            throw new IllegalStateException("Email already taken");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);
        logger.info("User signed up successfully with email: {}", user.getEmail());

        // TODO: Send confirmation token

        return user;
    }

    public UserDto getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return UserDto.builder()
                .id(user.get().getId())
                .firstName(user.get().getFirstName())
                .lastName(user.get().getLastName())
                .email(user.get().getEmail())
                .appUserRole(user.get().getAppUserRole())
                .profilePictureUrl(user.get().getProfilePictureUrl())
                .build();
    }
}
