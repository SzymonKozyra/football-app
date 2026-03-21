package pl.pollub.footballapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.pollub.footballapp.model.Injury;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.InjuryRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.InjuryRequest;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class InjuryServiceTest {

    @Mock
    private InjuryRepository injuryRepository;

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private InjuryService injuryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addInjury_ShouldThrowException_WhenPlayerNotFound() {
        // Given
        InjuryRequest request = new InjuryRequest("Knee Injury", LocalDate.now(), LocalDate.now().plusDays(10), 1L);

        when(playerRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> injuryService.addInjury(request));
        assertEquals("Player not found", exception.getMessage());
        verify(injuryRepository, never()).save(any());
    }

    @Test
    void addInjury_ShouldThrowException_WhenOverlappingInjuryExists() {
        // Given
        Player player = new Player();
        player.setId(1L);

        InjuryRequest request = new InjuryRequest("Knee Injury", LocalDate.now(), LocalDate.now().plusDays(10), 1L);

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));
        when(injuryRepository.existsOverlappingInjury(1L, "Knee Injury", LocalDate.now(), LocalDate.now().plusDays(10)))
                .thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> injuryService.addInjury(request));
        assertEquals("Overlapping injury already exists for this player", exception.getMessage());
        verify(injuryRepository, never()).save(any());
    }

    @Test
    void addInjury_ShouldSaveInjury_WhenValidDataProvided() {
        // Given
        Player player = new Player();
        player.setId(1L);

        InjuryRequest request = new InjuryRequest("Knee Injury", LocalDate.now(), LocalDate.now().plusDays(10), 1L);

        when(playerRepository.findById(1L)).thenReturn(Optional.of(player));
        when(injuryRepository.existsOverlappingInjury(1L, "Knee Injury", LocalDate.now(), LocalDate.now().plusDays(10)))
                .thenReturn(false);

        // When
        injuryService.addInjury(request);

        // Then
        verify(injuryRepository, times(1)).save(any(Injury.class));
    }
}
