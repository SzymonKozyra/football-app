package pl.pollub.footballapp.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CityRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CityServiceTest {

    private CityService cityService;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ImporterFactory importerFactory;

    @Mock
    private DataImporter dataImporter;

    @Mock
    private MultipartFile mockFile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        cityService = new CityService(cityRepository, countryRepository, importerFactory);
    }

    @Test
    @WithMockUser(roles = "MODERATOR")
    void testAddCity_Success() {
        // Arrange
        City cityRequest = new City();
        cityRequest.setName("Warsaw");
        Country country = new Country();
        country.setName("Poland");
        cityRequest.setCountry(country);

        when(countryRepository.findByName("Poland")).thenReturn(Optional.of(country));
        when(cityRepository.existsByNameAndCountry("Warsaw", country)).thenReturn(false);

        // Act
        ResponseEntity<?> response = cityService.addCity(cityRequest);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("City added successfully", response.getBody());
        verify(cityRepository, times(1)).save(any(City.class));
    }

    @Test
    void testAddCity_CountryNotFound() {
        // Arrange
        City cityRequest = new City();
        cityRequest.setName("Warsaw");
        Country country = new Country();
        country.setName("Poland");
        cityRequest.setCountry(country);

        when(countryRepository.findByName("Poland")).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = cityService.addCity(cityRequest);

        // Assert
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Country not found", response.getBody());
        verify(cityRepository, never()).save(any(City.class));
    }

    @Test
    void testImportCities_Success() throws IOException {
        // Arrange
        InputStream mockInputStream = mock(InputStream.class);
        when(mockFile.getInputStream()).thenReturn(mockInputStream);
        when(importerFactory.getImporterCity("json")).thenReturn(dataImporter);

        // Mockowanie importu danych
        when(dataImporter.importData(mockInputStream)).thenReturn(
                List.of(
                        new CityRequest("Warsaw", "Poland"),
                        new CityRequest("Krakow", "Poland")
                )
        );
        when(countryRepository.findByName("Poland")).thenReturn(Optional.of(new Country()));

        // Act
        ResponseEntity<?> response = cityService.importCities(mockFile, "json");

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Cities imported successfully"));
        verify(cityRepository, times(2)).save(any(City.class));
    }

    @Test
    void testImportCities_CountryNotFound() throws IOException {
        // Arrange
        InputStream mockInputStream = mock(InputStream.class);
        when(mockFile.getInputStream()).thenReturn(mockInputStream);
        when(importerFactory.getImporterCity("json")).thenReturn(dataImporter);

        when(dataImporter.importData(mockInputStream)).thenReturn(
                List.of(new CityRequest("Warsaw", "UnknownCountry"))
        );
        when(countryRepository.findByName("UnknownCountry")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            cityService.importCities(mockFile, "json");
        });
        verify(cityRepository, never()).save(any(City.class));
    }

    @Test
    void testImportCities_WithDuplicates() throws IOException {
        // Arrange
        InputStream mockInputStream = mock(InputStream.class);
        when(mockFile.getInputStream()).thenReturn(mockInputStream);
        when(importerFactory.getImporterCity("json")).thenReturn(dataImporter);

        when(dataImporter.importData(mockInputStream)).thenReturn(
                List.of(
                        new CityRequest("Warsaw", "Poland"),
                        new CityRequest("Warsaw", "Poland")
                )
        );

        Country country = new Country();
        country.setName("Poland");
        when(countryRepository.findByName("Poland")).thenReturn(Optional.of(country));
        when(cityRepository.existsByNameAndCountry("Warsaw", country)).thenReturn(true); // Duplikat

        // Act
        ResponseEntity<?> response = cityService.importCities(mockFile, "json");

        // Assert
        assertEquals(200, response.getStatusCodeValue()); // Operacja zakończona sukcesem
        assertTrue(response.getBody().toString().contains("Skipped records at positions: [1, 2]")); // Informacja o duplikatach
        verify(cityRepository, never()).save(any(City.class)); // Nic nie zapisano w bazie
    }

}
