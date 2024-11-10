package pl.pollub.footballapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.pollub.footballapp.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()  // Enable CORS
                .csrf().disable()  // Disable CSRF protection for API requests
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()  // Allow public access to login and register
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Restrict admin endpoints to ADMIN role
                        .requestMatchers("/api/countries").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()
                        .requestMatchers("/api/auth/reset-password-confirm").permitAll()
                        .requestMatchers("/api/auth/register-admin").permitAll()
                        .requestMatchers("/api/auth/check-admin").permitAll()
                        .requestMatchers("/api/coaches/search/**").hasRole("MODERATOR")

                        .requestMatchers("/api/coach-contracts/**").hasRole("MODERATOR")
                        .requestMatchers("/api/positions/**").permitAll()

                        //.requestMatchers("/api").permitAll()
                        .anyRequest().authenticated()  // Secure all other endpoints
                )
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Stateless session for JWT
                .and()
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);  // Add JWT filter before UsernamePasswordAuthentication

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
