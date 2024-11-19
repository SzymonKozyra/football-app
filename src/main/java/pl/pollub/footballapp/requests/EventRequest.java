package pl.pollub.footballapp.requests;

import pl.pollub.footballapp.EventType;

public class EventRequest {
    private Long matchId;
    private Long playerId;
    private int minute;
    private EventType type;
    private String partOfGame;

    // Getters and Setters
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

    @Override
    public String toString() {
        return "EventRequest{" +
                "matchId=" + matchId +
                ", playerId=" + playerId +
                ", minute=" + minute +
                ", type='" + type + '\'' +
                ", partOfGame='" + partOfGame + '\'' +
                '}';
    }
}
