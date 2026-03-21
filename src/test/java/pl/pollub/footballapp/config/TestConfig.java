package pl.pollub.footballapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.pollub.footballapp.service.FileStorageService;

@Configuration
public class TestConfig {

    @Bean
    public FileStorageService fileStorageService() {
        return new FileStorageService();
    }

}
