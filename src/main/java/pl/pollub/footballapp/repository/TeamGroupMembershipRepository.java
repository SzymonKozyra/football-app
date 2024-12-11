package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.TeamGroupMembership;

import java.util.Collection;
import java.util.List;

@Repository
public interface TeamGroupMembershipRepository extends JpaRepository<TeamGroupMembership, Long> {
    List<TeamGroupMembership> findByGroup(LeagueGroup group);

    @Query("SELECT t FROM Team t JOIN TeamGroupMembership m ON t.id = m.team.id WHERE m.group.id = :groupId")
    List<Team> findTeamsByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT t FROM TeamGroupMembership t WHERE t.group.id = :groupId")
    List<TeamGroupMembership> findByGroupId(@Param("groupId") Long groupId);

    @Modifying
    @Query("DELETE FROM TeamGroupMembership t WHERE t.group.id = :groupId AND t.team.id IN :teamIds")
    void deleteByGroupIdAndTeamIds(@Param("groupId") Long groupId, @Param("teamIds") List<Long> teamIds);

}
