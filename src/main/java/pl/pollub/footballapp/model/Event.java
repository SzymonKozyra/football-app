package pl.pollub.footballapp.model;

import jakarta.persistence.*;
import pl.pollub.footballapp.EventType;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = true)
    private Player player;

    private int minute;

    @Enumerated(EnumType.STRING)
    private EventType type;

    @Column(name = "part_of_game")
    private String partOfGame;

    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public String getPartOfGame() {
        return partOfGame;
    }

    public void setPartOfGame(String partOfGame) {
        this.partOfGame = partOfGame;
    }
}
