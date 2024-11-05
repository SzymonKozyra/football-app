package pl.pollub.footballapp.service.importer;

import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CityRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class CsvCityImporter implements DataImporter {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Override
    public List<CityRequest> importData(InputStream inputStream) throws IOException {
        List<CityRequest> cityRequests = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");

                if (data.length != 2) {
                    System.out.println("Invalid line format: " + line);
                    continue;
                }

                String cityName = data[0];
                String countryName = data[1];

                try{
                    Optional<Country> countryOpt = countryRepository.findByName(countryName);
                    if (countryOpt.isPresent()) {
                        City city = new City(cityName, countryOpt.get());
                        cityRepository.save(city);
                    } else {
                        System.err.println("Country not found: " + countryName);
                    }
                }
                catch (NullPointerException e) {
                    System.out.println("Country repository is not initialized.");
                    continue;
                }

            }
        }
        return cityRequests;
    }
//    public List<CityRequest> importData(InputStream inputStream) throws IOException {
//        List<CityRequest> cityRequests = new ArrayList<>();
//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
//            String line;
//
//            while ((line = reader.readLine()) != null) {
//                String[] data = line.split(",");
//                if (data.length != 2) {
//                    System.out.println("Invalid line format: " + line);
//                    continue;  // Kontynuuje do następnej linii
//                }
//
//                String cityName = data[0].trim();
//                String countryName = data[1].trim();
//
//                try {
//                    Optional<Country> countryOptional = countryRepository.findByName(countryName);
//                    if (countryOptional.isEmpty()) {
//                        System.out.println("Country not found: " + countryName);
//                        continue;  // Pomija dodanie tego miasta, jeśli kraj nie istnieje
//                    }
//
//                    CityRequest cityRequest = new CityRequest();
//                    cityRequest.setName(cityName);
//                    cityRequest.setCountryName(countryName);
//                    cityRequests.add(cityRequest);
//
//                } catch (NullPointerException e) {
//                    System.out.println("Country repository is not initialized.");
//                    // Możesz tutaj zdecydować, co dalej: rzucić wyjątek, przerwać dodawanie itp.
//                    break;
//                }
//            }
//        }
//        return cityRequests;
//    }
//


}
