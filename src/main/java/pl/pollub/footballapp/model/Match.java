package pl.pollub.footballapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime;

    @ManyToOne
    private Referee referee;

    @ManyToOne
    private Stadium stadium;

    @ManyToOne
    private League league;

    private int round;

    private double homePossession;
    private double awayPossession;

    private int homePasses;
    private int awayPasses;

    private int homeAccuratePasses;
    private int awayAccuratePasses;

    private int homeShots;
    private int awayShots;

    private int homeShotsOnGoal;
    private int awayShotsOnGoal;

    private int homeCorners;
    private int awayCorners;

    private int homeOffside;
    private int awayOffside;

    private int homeFouls;
    private int awayFouls;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Referee getReferee() {
        return referee;
    }

    public void setReferee(Referee referee) {
        this.referee = referee;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public double getHomePossession() {
        return homePossession;
    }

    public void setHomePossession(double homePossession) {
        this.homePossession = homePossession;
    }

    public double getAwayPossession() {
        return awayPossession;
    }

    public void setAwayPossession(double awayPossession) {
        this.awayPossession = awayPossession;
    }

    public int getHomePasses() {
        return homePasses;
    }

    public void setHomePasses(int homePasses) {
        this.homePasses = homePasses;
    }

    public int getAwayPasses() {
        return awayPasses;
    }

    public void setAwayPasses(int awayPasses) {
        this.awayPasses = awayPasses;
    }

    public int getHomeAccuratePasses() {
        return homeAccuratePasses;
    }

    public void setHomeAccuratePasses(int homeAccuratePasses) {
        this.homeAccuratePasses = homeAccuratePasses;
    }

    public int getAwayAccuratePasses() {
        return awayAccuratePasses;
    }

    public void setAwayAccuratePasses(int awayAccuratePasses) {
        this.awayAccuratePasses = awayAccuratePasses;
    }

    public int getHomeShots() {
        return homeShots;
    }

    public void setHomeShots(int homeShots) {
        this.homeShots = homeShots;
    }

    public int getAwayShots() {
        return awayShots;
    }

    public void setAwayShots(int awayShots) {
        this.awayShots = awayShots;
    }

    public int getHomeShotsOnGoal() {
        return homeShotsOnGoal;
    }

    public void setHomeShotsOnGoal(int homeShotsOnGoal) {
        this.homeShotsOnGoal = homeShotsOnGoal;
    }

    public int getAwayShotsOnGoal() {
        return awayShotsOnGoal;
    }

    public void setAwayShotsOnGoal(int awayShotsOnGoal) {
        this.awayShotsOnGoal = awayShotsOnGoal;
    }

    public int getHomeCorners() {
        return homeCorners;
    }

    public void setHomeCorners(int homeCorners) {
        this.homeCorners = homeCorners;
    }

    public int getAwayCorners() {
        return awayCorners;
    }

    public void setAwayCorners(int awayCorners) {
        this.awayCorners = awayCorners;
    }

    public int getHomeOffside() {
        return homeOffside;
    }

    public void setHomeOffside(int homeOffside) {
        this.homeOffside = homeOffside;
    }

    public int getAwayOffside() {
        return awayOffside;
    }

    public void setAwayOffside(int awayOffside) {
        this.awayOffside = awayOffside;
    }

    public int getHomeFouls() {
        return homeFouls;
    }

    public void setHomeFouls(int homeFouls) {
        this.homeFouls = homeFouls;
    }

    public int getAwayFouls() {
        return awayFouls;
    }

    public void setAwayFouls(int awayFouls) {
        this.awayFouls = awayFouls;
    }
}