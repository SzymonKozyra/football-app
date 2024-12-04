import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import Sidebar from "./Sidebar";
import TeamImageVerySmall from "./TeamImageVerySmall";

const BASE_URL = "http://localhost:8080";

const LeaguePage = () => {
    const { id } = useParams();
    const [matches, setMatches] = useState([]);
    const [league, setLeague] = useState(null);
    const [favorites, setFavorites] = useState({
        matches: [],
        leagues: [],
        teams: [],
    });
    const [activeTab, setActiveTab] = useState("matches");

    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        // Pobierz dane ligi
        axios
            .get(`${BASE_URL}/api/leagues/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setLeague(response.data))
            .catch((error) => console.error("Error fetching league:", error));

        // Pobierz mecze ligi
        axios
            .get(`${BASE_URL}/api/matches/league/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching matches for league:", error));
    }, [id, token]);

    const toggleFavorite = async (type, match) => {
        // Logika dodawania/usuwania z ulubionych (jeśli potrzeba, zaimplementuj tutaj)
    };

    const isFavorite = (type, id) => {
        const typeMap = {
            matches: (fav) => fav.match.id === id,
        };
        return favorites[type]?.some(typeMap[type]) || false;
    };

    const renderMatches = () => {
        const filteredMatches = matches
            .filter((match) => match.status === "UPCOMING" || match.status === "IN_PLAY")
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        return (
            <Card className="mt-4">
                <Card.Body>
                    {filteredMatches.map((match) => (
                        <Card className="mb-3" key={match.id}>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <i
                                        className={`bi ${
                                            isFavorite("matches", match.id)
                                                ? "bi-star-fill text-warning"
                                                : "bi-star"
                                        }`}
                                        style={{ cursor: "pointer", marginRight: "10px" }}
                                        onClick={() => toggleFavorite("matches", match)}
                                    ></i>
                                    <TeamImageVerySmall team={match.homeTeam} />
                                    <span style={{ marginLeft: "10px" }}>{match.homeTeam.name}</span>
                                    <span style={{ margin: "0 10px" }}>vs</span>
                                    <TeamImageVerySmall team={match.awayTeam} />
                                    <span style={{ marginLeft: "10px" }}>{match.awayTeam.name}</span>
                                </div>
                                <div>
                                    {match.status === "IN_PLAY" ? (
                                        <span style={{ color: "red" }}>Live</span>
                                    ) : (
                                        new Date(match.dateTime).toLocaleString()
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>
        );
    };

    const renderResults = () => {
        const filteredResults = matches
            .filter((match) => match.status === "FINISHED")
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        return (
            <Card className="mt-4">
                <Card.Body>
                    {filteredResults.map((match) => (
                        <Card className="mb-3" key={match.id}>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <TeamImageVerySmall team={match.homeTeam} />
                                    <span style={{ marginLeft: "10px" }}>{match.homeTeam.name}</span>
                                    <span style={{ margin: "0 10px" }}>vs</span>
                                    <TeamImageVerySmall team={match.awayTeam} />
                                    <span style={{ marginLeft: "10px" }}>{match.awayTeam.name}</span>
                                </div>
                                <div>
                                    <strong>
                                        {match.homeGoals} - {match.awayGoals}
                                    </strong>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Card.Body>
            </Card>
        );
    };

    const renderStandings = () => {
        return <p>Standings will be displayed here...</p>;
    };

    if (!league) return <p>Loading league...</p>;

    return (
        <Container fluid>
            <Row>
                <Col xs={3} className="bg-light border-right">
                    <Sidebar token={token} favorites={favorites} setFavorites={setFavorites} />
                </Col>
                <Col xs={9}>
                    <h3 className="mt-4">{league.name}</h3>
                    <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="matches">Matches</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="results">Results</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="standings">Standings</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {activeTab === "matches" && renderMatches()}
                    {activeTab === "results" && renderResults()}
                    {activeTab === "standings" && renderStandings()}
                </Col>
            </Row>
        </Container>
    );
};

export default LeaguePage;
