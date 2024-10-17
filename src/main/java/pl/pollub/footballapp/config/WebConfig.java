package pl.pollub.footballapp.config;  // Zmodyfikuj w zależności od struktury katalogów

import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Dotyczy wszystkich endpointów
                .allowedOrigins("http://localhost:3000")  // Zezwala na żądania z frontendu
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Dozwolone metody HTTP
                .allowedHeaders("*")  // Zezwala na wszystkie nagłówki
                .allowCredentials(true);  // Zezwala na ciasteczka lub inne dane pochodzące z przeglądarki
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
