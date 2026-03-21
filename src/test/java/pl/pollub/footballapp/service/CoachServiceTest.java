package pl.pollub.footballapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.CountryRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class CoachServiceTest {

    @Mock
    private CoachRepository coachRepository;

    @Mock
    private CountryRepository countryRepository;

    @InjectMocks
    private CoachService coachService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addCoach_ShouldThrowException_WhenCountryNotFound() {
        // Given
        Coach coach = new Coach();
        coach.setFirstName("John");
        coach.setLastName("Smith");
        Country country = new Country();
        country.setName("Poland");
        coach.setCountry(country);

        when(countryRepository.findByName("Poland")).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> coachService.addCoach(coach));
        assertEquals("Country not found", exception.getMessage());
        verify(countryRepository, times(1)).findByName("Poland");
        verify(coachRepository, never()).save(any());
    }

    @Test
    void addCoach_ShouldThrowException_WhenCoachAlreadyExists() {
        // Given
        Coach coach = new Coach();
        coach.setFirstName("John");
        coach.setLastName("Smith");
        coach.setDateOfBirth(LocalDate.parse("1980-01-01"));
        Country country = new Country();
        country.setName("Poland");
        coach.setCountry(country);

        when(countryRepository.findByName("Poland")).thenReturn(Optional.of(country));
        when(coachRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry("John", "Smith", LocalDate.parse("1980-01-01"), country))
                .thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> coachService.addCoach(coach));
        assertEquals("Coach already exists", exception.getMessage());
        verify(coachRepository, never()).save(any());
    }


    @Test
    void addCoach_ShouldSaveCoach_WhenValidDataProvided() {
        // Given
        Coach coach = new Coach();
        coach.setFirstName("John");
        coach.setLastName("Smith");
        coach.setDateOfBirth(LocalDate.parse("1980-01-01"));
        Country country = new Country();
        country.setName("Poland");
        coach.setCountry(country);

        when(countryRepository.findByName("Poland")).thenReturn(Optional.of(country));
        when(coachRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountry("John", "Smith", LocalDate.parse("1980-01-01"), country))
                .thenReturn(false);

        // When
        coachService.addCoach(coach);

        // Then
        verify(coachRepository, times(1)).save(any(Coach.class));
    }
}
