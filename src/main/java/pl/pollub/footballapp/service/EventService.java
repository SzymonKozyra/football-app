package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.EventType;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.Event;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.EventRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.MatchSquadRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.EventRequest;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private final EventRepository eventRepository;
    @Autowired
    private final MatchRepository matchRepository;
    @Autowired
    private final PlayerRepository playerRepository;
    @Autowired
    private MatchSquadRepository matchSquadRepository;

    @Autowired
    public EventService(EventRepository eventRepository, MatchRepository matchRepository, PlayerRepository playerRepository) {
        this.eventRepository = eventRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    public Event addEvent(EventRequest eventRequest) {
        Event event = new Event();
        // Logowanie wartości
        System.out.println("Received EventRequest: " + eventRequest);

        // Pobranie meczu
        Match match = matchRepository.findById(eventRequest.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + eventRequest.getMatchId()));
        event.setMatch(match);

        // Pobranie gracza (opcjonalnie)
        if (eventRequest.getPlayerId() != null) {
            Player player = playerRepository.findById(eventRequest.getPlayerId())
                    .orElseThrow(() -> new IllegalArgumentException("Player not found for ID: " + eventRequest.getPlayerId()));
            event.setPlayer(player);
        }

        // Ustawienie pozostałych pól
        event.setMinute(eventRequest.getMinute());
        event.setType(eventRequest.getType());
        event.setPartOfGame(eventRequest.getPartOfGame());

        // Logika biznesowa
        switch (event.getType()) {
            case GOAL:
            case FREE_KICK:
            case PENALTY:
                if(!event.getPartOfGame().equals("PENALTIES")) {
                    if (event.getPlayer() != null && event.getPlayer().getTeam().equals(match.getHomeTeam())) {
                        match.setHomeGoals(match.getHomeGoals() + 1);
                    } else if (event.getPlayer() != null) {
                        match.setAwayGoals(match.getAwayGoals() + 1);
                    }
                }
                break;
            case MATCH_START:
                match.setStatus(MatchStatus.IN_PLAY);
                match.setDuration(calculateMatchDuration(match.getId()));
                calculateMinutesPlayed(match.getId());
                break;
            case MATCH_END:
                match.setStatus(MatchStatus.FINISHED);
                match.setDuration(calculateMatchDuration(match.getId()));
                calculateMinutesPlayed(match.getId());
                break;
            case SUB_IN:
                Event subOffEvent = new Event();
                subOffEvent.setMatch(event.getMatch());
                subOffEvent.setMinute(event.getMinute());
                subOffEvent.setType(EventType.SUB_OFF);
                subOffEvent.setPartOfGame(event.getPartOfGame());
                eventRepository.save(subOffEvent);
                break;
            case YELLOW_CARD:
                // Sprawdzenie liczby żółtych kartek w meczu dla tego zawodnika
                long yellowCardCount = eventRepository.findByMatchId(match.getId()).stream()
                        .filter(e -> e.getType() == EventType.YELLOW_CARD &&
                                e.getPlayer() != null &&
                                e.getPlayer().getId().equals(event.getPlayer().getId()))
                        .count();

                if (yellowCardCount >= 1) {
                    // Dodanie zdarzenia RED_CARD
                    Event redCardEvent = new Event();
                    redCardEvent.setMatch(match);
                    redCardEvent.setPlayer(event.getPlayer());
                    redCardEvent.setMinute(event.getMinute());
                    redCardEvent.setType(EventType.RED_CARD);
                    redCardEvent.setPartOfGame(event.getPartOfGame());
                    eventRepository.save(redCardEvent);
                    System.out.println("Added RED_CARD for player " + event.getPlayer().getId() + " due to second yellow card.");
                }
                break;
        }

        matchRepository.save(match);
        return eventRepository.save(event);
    }

    private int calculateMatchDuration(Long matchId) {
        List<Event> events = eventRepository.findByMatchId(matchId);
        int duration = 0;

        for (Event event : events) {
            if (event.getType() == EventType.FIRST_HALF_END ||
                    event.getType() == EventType.SECOND_HALF_END ||
                    event.getType() == EventType.OT_FIRST_HALF_END ||
                    event.getType() == EventType.OT_SECOND_HALF_END) {
                duration += event.getMinute();
            }
        }
        return duration;
    }

    public List<Event> getEventsForMatch(Long matchId) {
        return eventRepository.findByMatchId(matchId);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }






    public void calculateMinutesPlayed(Long matchId) {
        // Pobranie meczu i jego zdarzeń
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + matchId));
        List<Event> events = eventRepository.findByMatchId(matchId);

        // Obliczenie czasu zakończenia poszczególnych części meczu
        int firstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int secondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otFirstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otSecondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);

        // Czas trwania meczu
        int matchDuration = firstHalfEnd + secondHalfEnd + otFirstHalfEnd + otSecondHalfEnd;

        // Przetwarzanie zawodników w MatchSquad
        List<MatchSquad> matchSquads = matchSquadRepository.findByMatchId(matchId);

        for (MatchSquad squad : matchSquads) {
            int minutesPlayed = 0;

            if (squad.isFirstSquad()) {
                // Dla zawodnika w pierwszym składzie
                Optional<Event> redCardEvent = events.stream()
                        .filter(event -> event.getType() == EventType.RED_CARD &&
                                event.getPlayer() != null &&
                                event.getPlayer().getId().equals(squad.getPlayer().getId()))
                        .findFirst();

                if (redCardEvent.isPresent()) {
                    // Jeśli zawodnik dostał czerwoną kartkę, sumujemy czas do momentu czerwonej kartki
                    int redCardMinute = redCardEvent.get().getMinute();

                    if (redCardEvent.get().getPartOfGame().equals("FIRST_HALF")) {
                        minutesPlayed = redCardMinute;
                    } else if (redCardEvent.get().getPartOfGame().equals("SECOND_HALF")) {
                        minutesPlayed = firstHalfEnd + redCardMinute;
                    } else if (redCardEvent.get().getPartOfGame().equals("OT_FIRST_HALF")) {
                        minutesPlayed = firstHalfEnd + secondHalfEnd + redCardMinute;
                    } else if (redCardEvent.get().getPartOfGame().equals("OT_SECOND_HALF")|| redCardEvent.get().getPartOfGame().equals("PENALTIES")) {
                        minutesPlayed = firstHalfEnd + secondHalfEnd + otFirstHalfEnd + redCardMinute;
                    }
                } else {
                    // Jeśli zawodnik nie dostał czerwonej kartki, grał cały mecz
                    minutesPlayed = matchDuration;
                }

            } else {
                // Dla zawodnika wchodzącego na zmianę
                Optional<Event> subInEvent = events.stream()
                        .filter(event -> event.getType() == EventType.SUB_IN &&
                                event.getPlayer() != null &&
                                event.getPlayer().getId().equals(squad.getPlayer().getId()))
                        .findFirst();
                Optional<Event> redCardEvent = events.stream()
                        .filter(event -> event.getType() == EventType.RED_CARD &&
                                event.getPlayer() != null &&
                                event.getPlayer().getId().equals(squad.getPlayer().getId()))
                        .findFirst();
                Optional<Event> subOffEvent = events.stream()
                        .filter(event -> event.getType() == EventType.SUB_OFF &&
                                event.getPlayer() != null &&
                                event.getPlayer().getId().equals(squad.getPlayer().getId()))
                        .findFirst();

                if (subInEvent.isPresent()) {
                    int entryMinute = subInEvent.get().getMinute();
                    if (redCardEvent.isPresent()) {
                        // Jeśli zawodnik dostał czerwoną kartkę
                        int redCardMinute = redCardEvent.get().getMinute();
                        minutesPlayed = (redCardEvent.get().getPartOfGame().equals("SECOND_HALF") ? firstHalfEnd : firstHalfEnd + secondHalfEnd)
                                + redCardMinute - entryMinute;
                    } else {
                        // Jeśli zawodnik nie dostał czerwonej kartki
                        int exitMinute = subOffEvent.map(Event::getMinute).orElse(matchDuration);
                        minutesPlayed = exitMinute - entryMinute;
                    }
                }
            }

            // Aktualizacja czasu gry
            squad.setMinutesPlayed(minutesPlayed);
            matchSquadRepository.save(squad);
        }
    }




    // Metoda obliczająca całkowity czas meczu
    private int calculateMatchDurationFromEvents(List<Event> events) {
        int firstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int secondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otFirstHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_FIRST_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int otSecondHalfEnd = events.stream()
                .filter(event -> event.getType() == EventType.OT_SECOND_HALF_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(0);
        int matchEnd = events.stream()
                .filter(event -> event.getType() == EventType.MATCH_END)
                .map(Event::getMinute)
                .findFirst()
                .orElse(Math.max(secondHalfEnd, otSecondHalfEnd));

        return firstHalfEnd + secondHalfEnd + otFirstHalfEnd + otSecondHalfEnd + (matchEnd - secondHalfEnd);
    }

}
