package pl.pollub.footballapp.service.importer;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.service.importer.CsvStadiumImporter;
import pl.pollub.footballapp.service.importer.JsonStadiumImporter;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.CsvCoachImporter;

@Component
public class ImporterFactory {

    @Autowired
    private JsonStadiumImporter jsonStadiumImporter;

    @Autowired
    private CsvStadiumImporter csvStadiumImporter;

    @Autowired
    private CsvLeagueImporter csvLeagueImporter;

    @Autowired
    private JsonLeagueImporter jsonLeagueImporter;

    @Autowired
    private CsvCoachImporter csvCoachImporter;

    @Autowired
    private JsonCoachImporter jsonCoachImporter;

    public DataImporter getImporter(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonStadiumImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvStadiumImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }
    public DataImporter getImporterLeague(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonLeagueImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvLeagueImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }
    public DataImporter getImporterCoach(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonCoachImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvCoachImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }
}