package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;


import pl.pollub.footballapp.model.CoachesTransfer;
import pl.pollub.footballapp.requests.CoachesTransferRequest;
import pl.pollub.footballapp.service.CoachesTransferService;



@RestController
@RequestMapping("/api/coaches-transfers")
public class CoachesTransferController {

    private final CoachesTransferService coachesTransferService;

    @Autowired
    public CoachesTransferController(CoachesTransferService coachesTransferService) {
        this.coachesTransferService = coachesTransferService;
    }

    @PostMapping("/add")
    public ResponseEntity<CoachesTransfer> addCoachesTransfer(@RequestBody CoachesTransferRequest request) {
        CoachesTransfer transfer = coachesTransferService.addTransfer(request);
        return ResponseEntity.ok(transfer);
    }
}