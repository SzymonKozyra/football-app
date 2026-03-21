package pl.pollub.footballapp;

import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;

public class TestDataUtil {


    public static City createTestCityA(Country country) {
        return new City("Leczna", country);
    }

    public static City createTestCityB(Country country) {
        return new City("Swidnik", country);
    }

    public static City createTestCityC(Country country) {
        return new City("Lublin", country);
    }


}
