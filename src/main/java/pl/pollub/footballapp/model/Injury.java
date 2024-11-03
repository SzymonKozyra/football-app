package pl.pollub.footballapp.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Injury {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    public Long getId() {
        return id;
    }

//    public void setId(Long id) {
//        this.id = id;
//    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }
}

