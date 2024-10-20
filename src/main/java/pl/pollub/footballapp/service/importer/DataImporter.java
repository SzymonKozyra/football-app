package pl.pollub.footballapp.service.importer;

import pl.pollub.footballapp.requests.StadiumRequest;

import java.io.InputStream;
import java.io.IOException;
import java.util.List;

public interface DataImporter {
    <T> List<T> importData(InputStream inputStream) throws IOException;
}