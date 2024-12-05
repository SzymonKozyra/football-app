package pl.pollub.footballapp.requests;

public class CityRequest {
    private String name;
    private String countryName;

    // Getters and setters
    public CityRequest(String name, String countryName) {
        this.name = name;
        this.countryName = countryName;
    }

    public CityRequest() {
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