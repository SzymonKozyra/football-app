package pl.pollub.footballapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.pollub.footballapp.EventType;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.EventRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.MatchSquadRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.EventRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventServiceTest {

    @InjectMocks
    private EventService eventService;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private MatchSquadRepository matchSquadRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddEvent_GoalEvent() {
        // Arrange
        EventRequest eventRequest = new EventRequest();
        eventRequest.setMatchId(1L);
        eventRequest.setPlayerId(2L);
        eventRequest.setMinute(10);
        eventRequest.setType(EventType.GOAL);
        eventRequest.setPartOfGame("FIRST_HALF");

        // Tworzenie meczu
        Team homeTeam = new Team();
        homeTeam.setId(1L);

        Team awayTeam = new Team();
        awayTeam.setId(2L);

        Match match = new Match();
        match.setId(1L);
        match.setHomeTeam(homeTeam); // Przypisanie drużyny gospodarzy
        match.setAwayTeam(awayTeam); // Przypisanie drużyny gości
        match.setHomeGoals(0);
        match.setAwayGoals(0);

        // Tworzenie gracza
        Player player = new Player();
        player.setId(2L);
        player.setTeam(homeTeam); // Przypisanie gracza do drużyny gospodarzy

        // Mockowanie zależności
        when(matchRepository.findById(1L)).thenReturn(Optional.of(match));
        when(playerRepository.findById(2L)).thenReturn(Optional.of(player));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Event result = eventService.addEvent(eventRequest);

        // Assert
        assertNotNull(result);
        assertEquals(EventType.GOAL, result.getType());
        assertEquals(10, result.getMinute());
        assertEquals(1, match.getHomeGoals(), "Home team goals should be incremented by 1.");
        verify(matchRepository, times(1)).save(match);
        verify(eventRepository, times(1)).save(any(Event.class));
    }


    @Test
    void testAddEvent_PlayerNotFound() {
        // Arrange
        EventRequest eventRequest = new EventRequest();
        eventRequest.setMatchId(1L);
        eventRequest.setPlayerId(2L);

        when(matchRepository.findById(1L)).thenReturn(Optional.of(new Match()));
        when(playerRepository.findById(2L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> eventService.addEvent(eventRequest));
        assertEquals("Player not found for ID: 2", exception.getMessage());
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void testDeleteEvent_Success() {
        // Arrange
        Long eventId = 1L;

        doNothing().when(eventRepository).deleteById(eventId);

        // Act
        eventService.deleteEvent(eventId);

        // Assert
        verify(eventRepository, times(1)).deleteById(eventId);
    }

    @Test
    void testGetEventsForMatch() {
        // Arrange
        Long matchId = 1L;
        Event event1 = new Event();
        Event event2 = new Event();
        when(eventRepository.findByMatchId(matchId)).thenReturn(List.of(event1, event2));

        // Act
        List<Event> events = eventService.getEventsForMatch(matchId);

        // Assert
        assertEquals(2, events.size());
        verify(eventRepository, times(1)).findByMatchId(matchId);
    }

    @Test
    void testCalculateMatchDurationFromEvents() {
        // Arrange
        Long matchId = 1L;

        Event firstHalfEnd = new Event();
        firstHalfEnd.setType(EventType.FIRST_HALF_END);
        firstHalfEnd.setMinute(45);

        Event secondHalfEnd = new Event();
        secondHalfEnd.setType(EventType.SECOND_HALF_END);
        secondHalfEnd.setMinute(45);

        Event otFirstHalfEnd = new Event();
        otFirstHalfEnd.setType(EventType.OT_FIRST_HALF_END);
        otFirstHalfEnd.setMinute(15);

        Event otSecondHalfEnd = new Event();
        otSecondHalfEnd.setType(EventType.OT_SECOND_HALF_END);
        otSecondHalfEnd.setMinute(15);

        List<Event> events = List.of(firstHalfEnd, secondHalfEnd, otFirstHalfEnd, otSecondHalfEnd);

        when(eventRepository.findByMatchId(matchId)).thenReturn(events);

        // Act
        int matchDuration = eventService.calculateMatchDurationFromEvents(events);

        // Assert
        assertEquals(120, matchDuration, "The calculated match duration should be 120 minutes.");
    }

}
