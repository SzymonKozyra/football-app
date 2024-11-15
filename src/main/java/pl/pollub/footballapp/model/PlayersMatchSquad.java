package pl.pollub.footballapp.model;

import jakarta.persistence.Entity;

import jakarta.persistence.*;

@Entity
public class PlayersMatchSquad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long playerId;
    private Long matchSquadId;
    private Integer entryMinute;
    private Integer exitMinute;


    public PlayersMatchSquad() {}

    public PlayersMatchSquad(Long playerId, Long matchSquadId, Integer entryMinute, Integer exitMinute) {
        this.playerId = playerId;
        this.matchSquadId = matchSquadId;
        this.entryMinute = entryMinute;
        this.exitMinute = exitMinute;
    }

    public Long getId() {
        return id;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Long getMatchSquadId() {
        return matchSquadId;
    }

    public void setMatchSquadId(Long matchSquadId) {
        this.matchSquadId = matchSquadId;
    }

    public Integer getEntryMinute() {
        return entryMinute;
    }

    public void setEntryMinute(Integer entryMinute) {
        this.entryMinute = entryMinute;
    }

    public Integer getExitMinute() {
        return exitMinute;
    }

    public void setExitMinute(Integer exitMinute) {
        this.exitMinute = exitMinute;
    }
}

