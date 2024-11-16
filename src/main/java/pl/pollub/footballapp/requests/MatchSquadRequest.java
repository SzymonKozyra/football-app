package pl.pollub.footballapp.requests;

public class MatchSquadRequest {
    private Long matchId;
    private Long playerId;
    private Boolean isHomeTeam;
    private Boolean firstSquad;

    // Gettery i settery

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Boolean getHomeTeam() {
        return isHomeTeam;
    }

    public void setIsHomeTeam(Boolean isHomeTeam) { // Zaktualizowana nazwa metody
        this.isHomeTeam = isHomeTeam;
    }

    public Boolean getFirstSquad() {
        return firstSquad;
    }

    public void setFirstSquad(Boolean firstSquad) {
        this.firstSquad = firstSquad;
    }

    public MatchSquadRequest() {
    }
}