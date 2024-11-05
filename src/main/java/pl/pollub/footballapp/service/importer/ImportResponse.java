package pl.pollub.footballapp.service.importer;

import pl.pollub.footballapp.requests.CityRequest;

import java.util.List;

public class ImportResponse {
    private List<CityRequest> successfulImports;
    private List<String> failedImports;

    public ImportResponse(List<CityRequest> successfulImports, List<String> failedImports) {
        this.successfulImports = successfulImports;
        this.failedImports = failedImports;
    }

    // Getters and setters
}
