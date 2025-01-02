import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import Sidebar from "./Sidebar";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";
import PlayerImageSmall from "./PlayerImageSmall";
import PlayerImage from "./PlayerImage";
import TeamImageVerySmall from "./TeamImageVerySmall"; // Importujemy komponent do zdjęcia

const BASE_URL = "http://localhost:8080";

const PlayerPage = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [injuries, setInjuries] = useState([]);
    const [activeTab, setActiveTab] = useState("information");

    const token = localStorage.getItem("jwtToken");

    const contractsPagination = UsePagination(contracts, 5);
    const injuriesPagination = UsePagination(injuries, 5);

    useEffect(() => {
        // Fetch player information
        axios
            .get(`${BASE_URL}/api/players/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setPlayer(response.data))
            .catch((error) => console.error("Error fetching player:", error));

        // Fetch player contracts
        axios
            .get(`${BASE_URL}/api/player-contracts/player/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setContracts(response.data))
            .catch((error) => console.error("Error fetching contracts:", error));

        // Fetch player injuries
        axios
            .get(`${BASE_URL}/api/injuries/player/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => setInjuries(response.data))
            .catch((error) => console.error("Error fetching injuries:", error));
    }, [id, token]);

    const renderPlayerInformation = () => {
        if (!player) return <p>Loading player information...</p>;

        const calculateAge = (birthDate) => {
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        };
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        };

        return (
            <Card className="mb-4">
                <Card.Body>
                    <h5>Informacje ogólne</h5>
                    <table className="table table-bordered">
                        <tbody>
                        {/* Drużyna */}
                        <tr>
                            <td className="bg-light"><strong>Drużyna:</strong></td>
                            <td className="text-center">
                                {player.team ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <TeamImageVerySmall team={player.team} />

                                        <span>{player.team.name}</span>
                                    </div>
                                ) : (
                                    "Brak drużyny"
                                )}
                            </td>
                        </tr>

                        {/* Pozycja */}
                        <tr>
                            <td className="bg-light"><strong>Pozycja:</strong></td>
                            <td className="text-center">{player.position?.name || "Nieznana"}</td>
                        </tr>

                        {/* Kraj */}
                        <tr>
                            <td className="bg-light"><strong>Kraj:</strong></td>
                            <td className="text-center">
                                {player.country ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <img
                                            src={`/assets/flags/${player.country.code}.svg`}
                                            alt={player.country.name}
                                            style={{
                                                width: "20px",
                                                height: "15px",
                                                marginRight: "10px",
                                                borderRadius: "2px",
                                                boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
                                            }}
                                        />
                                        <span>{player.country.name}</span>
                                    </div>
                                ) : (
                                    "Nieznany kraj"
                                )}
                            </td>
                        </tr>

                        {/* Pseudonim */}
                        <tr>
                            <td className="bg-light"><strong>Pseudonim:</strong></td>
                            <td className="text-center">{player.nickname || "Brak pseudonimu"}</td>
                        </tr>

                        {/* Wiek */}
                        <tr>
                            <td className="bg-light"><strong>Wiek:</strong></td>
                            <td className="text-center">
                                {player.dateOfBirth
                                    ? `${formatDate(player.dateOfBirth)} (${calculateAge(player.dateOfBirth)})`
                                    : "Nieznana"}
                            </td>
                        </tr>

                        {/* Wartość rynkowa */}
                        <tr>
                            <td className="bg-light"><strong>Wartość rynkowa:</strong></td>
                            <td className="text-center">${player.value?.toLocaleString() || "Nieznana"}</td>
                        </tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        );
    };




    const renderTransfers = () => {
        const { currentResults, totalPages, currentPage, handlePageChange } = contractsPagination;

        const transferTypeMap = {
            TRANSFER: "Transfer",
            LOAN: "Loan",
            END_LOAN: "End of loan",
        };

        return (
            <Card className="mb-4">
                <Card.Body>
                    <h5>Historia transferów</h5>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Do klubu</th>
                            <th>Kwota</th>
                            <th>Typ transferu</th>
                            <th>Wynagrodzenie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentResults.map((contract) => (
                            <tr key={contract.id}>
                                <td>{contract.startDate}</td>
                                <td>{contract.team?.name || "N/A"}</td>
                                <td>${contract.transferFee?.toLocaleString() || "Free"}</td>
                                <td>{transferTypeMap[contract.transferType] || "N/A"}</td>
                                <td>${contract.salary?.toLocaleString() || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <PaginationComponent
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </Card.Body>
            </Card>
        );
    };

    const renderInjuries = () => {
        if (injuries.length === 0) {
            return <p>Brak kontuzji dla tego zawodnika.</p>;
        }

        return (
            <Card className="mb-4">
                <Card.Body>
                    <h5>Historia kontuzji</h5>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Typ kontuzji</th>
                            <th>Data rozpoczęcia</th>
                            <th>Data zakończenia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {injuries.map((injury) => (
                            <tr key={injury.id}>
                                <td>{injury.type || "Nieznany"}</td>
                                <td>{injury.startDate || "Nieznana"}</td>
                                <td>{injury.endDate || "Otwarta"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        );
    };

    if (!player) return <p>Sorry, we can't find that player :(</p>;

    return (
        <Container fluid>
            <Row>
                <Col md={3} className="bg-light border-right">
                    <Sidebar />
                </Col>
                <Col md={9} style={{ marginTop: "20px" }}>
                    <div className="d-flex align-items-center mb-4">
                        <PlayerImage player={player} />
                        <h3 className="ms-3">{player.firstName} {player.lastName}</h3>
                    </div>
                    <Nav
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={(selectedKey) => setActiveTab(selectedKey)}
                        className="justify-content-center"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="information">Player Information</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="transfers">Transfers</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="injuries">Injuries</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {activeTab === "information" && renderPlayerInformation()}
                    {activeTab === "transfers" && renderTransfers()}
                    {activeTab === "injuries" && renderInjuries()}
                </Col>
            </Row>
        </Container>
    );
};

export default PlayerPage;
