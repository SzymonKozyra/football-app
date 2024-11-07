import React, { useState } from 'react';
import AddLeagueForm from '../components/AddLeagueForm';
import LeagueSearchAndEditForm from '../components/LeagueSearchAndEditForm';
import AddCoachForm from '../components/AddCoachForm';
import CoachSearchAndEditForm from '../components/CoachSearchAndEditForm';
import AddTeamForm from '../components/AddTeamForm';
import TeamSearchAndEditForm from '../components/TeamSearchAndEditForm';
import AddStadiumForm from '../components/AddStadiumForm';
import StadiumSearchAndEditForm from '../components/StadiumSearchAndEditForm';
import AddCityForm from '../components/AddCityForm';
import AddPlayerForm from '../components/AddPlayerForm';
import PlayerSearchAndEditForm from '../components/PlayerSearchAndEditForm';
import PlayerImportForm from '../components/PlayerImportForm';
import AddRefereeForm from '../components/AddRefereeForm';
import RefereeSearchAndEditForm from '../components/RefereeSearchAndEditForm';
import AddInjuryForm from '../components/AddInjuryForm';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

const ModeratorView = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);

    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case 'AddLeague': return <AddLeagueForm />;
            case 'EditLeagues': return <LeagueSearchAndEditForm />;
            case 'AddCoach': return <AddCoachForm />;
            case 'EditCoaches': return <CoachSearchAndEditForm />;
            case 'AddTeam': return <AddTeamForm />;
            case 'EditTeams': return <TeamSearchAndEditForm />;
            case 'AddStadium': return <AddStadiumForm />;
            case 'EditStadiums': return <StadiumSearchAndEditForm />;
            case 'AddCity': return <AddCityForm />;
            case 'AddPlayer': return <AddPlayerForm />;
            case 'EditPlayers': return <PlayerSearchAndEditForm />;
            case 'ImportPlayers': return <PlayerImportForm />;
            case 'AddReferee': return <AddRefereeForm />;
            case 'EditReferees': return <RefereeSearchAndEditForm />;
            case 'AddInjury': return <AddInjuryForm />;
            default: return <p>Please select an option from the sidebar.</p>;
        }
    };

    return (
        <Container fluid className="my-5">
            <Row>
                {/* Sidebar */}
                <Col md={3}>
                    <h4 className="mb-4">Moderator Panel</h4>
                    <ListGroup>
                        <ListGroup.Item variant="secondary"><b>Add Data</b></ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddLeague')}>Add League</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddCoach')}>Add Coach</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddTeam')}>Add Team</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddStadium')}>Add Stadium</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddCity')}>Add City</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddPlayer')}>Add Player</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddReferee')}>Add Referee</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('AddInjury')}>Add Injury</ListGroup.Item>
                    </ListGroup>
                    <ListGroup className="mt-4">
                        <ListGroup.Item variant="secondary"><b>Edit Data</b></ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditLeagues')}>Edit Leagues</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditCoaches')}>Edit Coaches</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditTeams')}>Edit Teams</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditStadiums')}>Edit Stadiums</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditPlayers')}>Edit Players</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('ImportPlayers')}>Import Players</ListGroup.Item>
                        <ListGroup.Item action onClick={() => setSelectedComponent('EditReferees')}>Edit Referees</ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* Main Content Area */}
                <Col md={9}>
                    <h4 className="mb-4 text-center">Football Data Management</h4>
                    <div className="p-4 border rounded shadow-sm bg-light">
                        {renderSelectedComponent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ModeratorView;
