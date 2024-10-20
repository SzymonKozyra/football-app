package pl.pollub.footballapp.model;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "coaches_transfers")
public class CoachesTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Column(name = "previous_club", nullable = false)
    private String previousClub;

    @Column(name = "destination_club", nullable = false)
    private String destinationClub;

    @Column(name = "value", nullable = false)
    private long value;

    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;


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

    public Coach getCoach() {
        return coach;
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
    }
}
