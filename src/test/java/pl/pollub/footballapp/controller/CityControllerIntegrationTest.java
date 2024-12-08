package pl.pollub.footballapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.service.CityService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
class CityControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CityService cityService;

    @Test
    @WithMockUser(roles = "MODERATOR")
    void testAddCity_WithDoReturn() throws Exception {
        // Arrange
        City city = new City();
        city.setName("Warsaw");

        doReturn(ResponseEntity.ok("City added successfully"))
                .when(cityService).addCity(any(City.class));

        // Act & Assert
        mockMvc.perform(post("/api/cities/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Warsaw\", \"country\": {\"name\": \"Poland\"}}"))
                .andExpect(status().isOk())
                .andExpect(content().string("City added successfully"));
    }

    @Test
    @WithMockUser(roles = "MODERATOR")
    void testSearchCities() throws Exception {
        // Arrange
        when(cityService.searchCities("Warsaw"))
                .thenReturn(ResponseEntity.ok(List.of(new City("Warsaw", null))));

        // Act & Assert
        mockMvc.perform(get("/api/cities/search")
                        .param("query", "Warsaw"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Warsaw"));
    }

    @Test
    @WithMockUser(roles = "MODERATOR")
    void testImportCities_Success() throws Exception {
        // Arrange
        doReturn(ResponseEntity.ok("Cities imported successfully"))
                .when(cityService).importCities(any(MultipartFile.class), any(String.class));

        // Act & Assert
        mockMvc.perform(multipart("/api/cities/import")
                        .file("file", "mock file content".getBytes())
                        .param("type", "json"))
                .andExpect(status().isOk())
                .andExpect(content().string("Cities imported successfully"));
    }

    @Test
    void testAddCity_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/cities/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"Warsaw\", \"country\": {\"name\": \"Poland\"}}"))
                .andExpect(status().isForbidden()); // No authenticated user
    }

    @Test
    void testSearchCities_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/cities/search")
                        .param("query", "Warsaw"))
                .andExpect(status().isForbidden()); // No authenticated user
    }

    @Test
    void testImportCities_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(multipart("/api/cities/import")
                        .file("file", "mock file content".getBytes())
                        .param("type", "json"))
                .andExpect(status().isForbidden()); // No authenticated user
    }
}

