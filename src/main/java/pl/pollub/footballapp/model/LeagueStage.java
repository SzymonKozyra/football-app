package pl.pollub.footballapp.model;

import jakarta.persistence.*;

@Entity
public class LeagueStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public LeagueStage() {

    }


    // Getters and setters

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

    public LeagueStage(String name) {
        this.name = name;
    }
}