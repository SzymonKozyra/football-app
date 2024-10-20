package pl.pollub.footballapp.requests;

public class LeagueRequest {
    private String name;
    private String countryName;

    // Constructors, Getters, and Setters
    public LeagueRequest() {}

    public LeagueRequest(String name, String countryName) {
        this.name = name;
        this.countryName = countryName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }
}
