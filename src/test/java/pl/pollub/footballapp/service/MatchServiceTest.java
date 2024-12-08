package pl.pollub.footballapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.repository.MatchRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MatchServiceTest {

    @InjectMocks
    private MatchService matchService;

    @Mock
    private MatchRepository matchRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveMatch() {
        Match match = new Match();
        match.setId(1L);

        when(matchRepository.save(match)).thenReturn(match);

        Match savedMatch = matchService.saveMatch(match);

        assertEquals(1L, savedMatch.getId());
        verify(matchRepository, times(1)).save(match);
    }

    @Test
    void testGetAllMatches() {
        List<Match> matches = List.of(new Match(), new Match());

        when(matchRepository.findAll()).thenReturn(matches);

        List<Match> result = matchService.getAllMatches();

        assertEquals(2, result.size());
        verify(matchRepository, times(1)).findAll();
    }

    @Test
    void testGetMatchById() {
        Match match = new Match();
        match.setId(1L);

        when(matchRepository.findById(1L)).thenReturn(Optional.of(match));

        Optional<Match> result = matchService.getMatchById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(matchRepository, times(1)).findById(1L);
    }

    @Test
    void testGetMatchById_NotFound() {
        when(matchRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Match> result = matchService.getMatchById(1L);

        assertFalse(result.isPresent());
        verify(matchRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteMatch() {
        matchService.deleteMatch(1L);

        verify(matchRepository, times(1)).deleteById(1L);
    }

    @Test
    void testUpdateMatch_Success() {
        Match existingMatch = new Match();
        existingMatch.setId(1L);
        Match updatedMatch = new Match();
        updatedMatch.setId(1L);
        updatedMatch.setHomeGoals(3);

        when(matchRepository.findById(1L)).thenReturn(Optional.of(existingMatch));
        when(matchRepository.save(any(Match.class))).thenReturn(updatedMatch);

        Match result = matchService.updateMatch(1L, updatedMatch);

        assertEquals(3, result.getHomeGoals());
        verify(matchRepository, times(1)).findById(1L);
        verify(matchRepository, times(1)).save(any(Match.class));
    }

    @Test
    void testUpdateMatch_NotFound() {
        when(matchRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            matchService.updateMatch(1L, new Match());
        });

        assertEquals("Match with ID 1 not found", exception.getMessage());
        verify(matchRepository, times(1)).findById(1L);
        verify(matchRepository, never()).save(any(Match.class));
    }

    @Test
    void testFindMatchesByTeamName() {
        List<Match> matches = List.of(new Match(), new Match());

        when(matchRepository.searchByTeamName("Team A")).thenReturn(matches);

        List<Match> result = matchService.findMatchesByTeamName("Team A");

        assertEquals(2, result.size());
        verify(matchRepository, times(1)).searchByTeamName("Team A");
    }

    @Test
    void testGetMatchesByDate() {
        // Arrange
        LocalDate date = LocalDate.of(2024, 12, 5);
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        Match match1 = new Match();
        match1.setDateTime(startOfDay.plusHours(2)); // Dodaj datę w zakresie

        Match match2 = new Match();
        match2.setDateTime(startOfDay.plusHours(5)); // Dodaj datę w zakresie

        List<Match> matches = List.of(match1, match2);

        when(matchRepository.findAllByDateTimeBetween(startOfDay, endOfDay)).thenReturn(matches);

        // Act
        List<Match> result = matchService.getMatchesByDate(date);

        // Assert
        assertEquals(2, result.size()); // Oczekuj 2 meczów
        verify(matchRepository, times(1)).findAllByDateTimeBetween(startOfDay, endOfDay);
    }


    @Test
    void testGetMatchesByLeague() {
        List<Match> matches = List.of(new Match(), new Match());

        when(matchRepository.findByLeagueId(1L)).thenReturn(matches);

        List<Match> result = matchService.getMatchesByLeague(1L);

        assertEquals(2, result.size());
        verify(matchRepository, times(1)).findByLeagueId(1L);
    }
}
