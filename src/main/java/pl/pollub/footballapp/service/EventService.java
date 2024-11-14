package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Event;
import pl.pollub.footballapp.repository.EventRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setMinute(updatedEvent.getMinute());
                    event.setMatch(updatedEvent.getMatch());
                    event.setPlayer(updatedEvent.getPlayer());
                    event.setType(updatedEvent.getType());
                    return eventRepository.save(event);
                })
                .orElseThrow(() -> new RuntimeException("Event with ID " + id + " not found"));
    }
}
