package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.CoachesTransfer;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.CoachesTransferRepository;
import pl.pollub.footballapp.requests.CoachesTransferRequest;

@Service
public class CoachesTransferService {

    private final CoachesTransferRepository coachesTransferRepository;
    private final CoachRepository coachRepository;  // Zakładam, że masz CoachRepository

    @Autowired
    public CoachesTransferService(CoachesTransferRepository coachesTransferRepository, CoachRepository coachRepository) {
        this.coachesTransferRepository = coachesTransferRepository;
        this.coachRepository = coachRepository;
    }

    public CoachesTransfer addTransfer(CoachesTransferRequest request) {
        CoachesTransfer transfer = new CoachesTransfer();
        transfer.setTransferDate(request.getTransferDate());
        transfer.setPreviousClub(request.getPreviousClub());
        transfer.setDestinationClub(request.getDestinationClub());
        transfer.setValue(request.getValue());

        // Znajdź trenera na podstawie coachId
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid coach ID"));
        transfer.setCoach(coach);

        return coachesTransferRepository.save(transfer);
    }
}
