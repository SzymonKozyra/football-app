package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.TeamGroupMembership;

import java.util.List;

@Repository
public interface TeamGroupMembershipRepository extends JpaRepository<TeamGroupMembership, Long> {
    List<TeamGroupMembership> findByGroup(LeagueGroup group);
}
