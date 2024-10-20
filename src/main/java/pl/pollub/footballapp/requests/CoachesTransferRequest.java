package pl.pollub.footballapp.requests;


import java.time.LocalDate;

public class CoachesTransferRequest {

    private Long coachId;
    private LocalDate transferDate;
    private String previousClub;
    private String destinationClub;
    private long value;

    // Getters and setters


    public Long getCoachId() {
        return coachId;
    }

//    public void setCoachId(Long coachId) {
//        this.coachId = coachId;
//    }

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
    }

    public String getPreviousClub() {
        return previousClub;
    }

    public void setPreviousClub(String previousClub) {
        this.previousClub = previousClub;
    }

    public String getDestinationClub() {
        return destinationClub;
    }

    public void setDestinationClub(String destinationClub) {
        this.destinationClub = destinationClub;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }
}
