package pl.pollub.footballapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String picture;
    private BigDecimal value = BigDecimal.ZERO; // default value
    private boolean isClub;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public boolean isClub() {
        return isClub;
    }

    public void setIsClub(boolean club) {
        isClub = club;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }

    @ManyToOne
    @JoinColumn(name = "league_id")
    private League league;

    // Getters and setters
}
