package pl.pollub.footballapp.service.importer;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.service.importer.CsvStadiumImporter;
import pl.pollub.footballapp.service.importer.JsonStadiumImporter;
import pl.pollub.footballapp.service.importer.DataImporter;

@Component
public class ImporterFactory {

    @Autowired
    private JsonStadiumImporter jsonStadiumImporter;

    @Autowired
    private CsvStadiumImporter csvStadiumImporter;

    public DataImporter getImporter(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonStadiumImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvStadiumImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }
}