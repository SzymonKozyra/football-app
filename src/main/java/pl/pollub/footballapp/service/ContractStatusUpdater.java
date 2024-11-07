package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.model.CoachContract;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.repository.CoachContractRepository;
import pl.pollub.footballapp.repository.PlayerContractRepository;

import java.time.LocalDate;
import java.util.List;

@Component
public class ContractStatusUpdater {

    private final PlayerContractRepository playerContractRepository;
    private final CoachContractRepository coachContractRepository;

    @Autowired
    public ContractStatusUpdater(PlayerContractRepository playerContractRepository,
                                 CoachContractRepository coachContractRepository) {
        this.playerContractRepository = playerContractRepository;
        this.coachContractRepository = coachContractRepository;
    }

    // Zadanie uruchamiane co godzine
    @Scheduled(cron = "0 0 * * * ?")
    public void updateContractStatuses() {
        // Aktualizacja kontraktów zawodników
        List<PlayerContract> playerContracts = playerContractRepository.findByIsActiveAndEndDateBefore(true, LocalDate.now());
        for (PlayerContract contract : playerContracts) {
            contract.setIsActive(false);
            playerContractRepository.save(contract);
        }

        // Aktualizacja kontraktów trenerów
        List<CoachContract> coachContracts = coachContractRepository.findByIsActiveAndEndDateBefore(true, LocalDate.now());
        for (CoachContract contract : coachContracts) {
            contract.setIsActive(false);
            coachContractRepository.save(contract);
        }
    }
}
