import React, { useState } from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";
import TeamImage from "./TeamImage";
import MatchEvents from "./MatchEvents";
import "./MatchDetail.css";
import MatchStatistics from "./MatchStatistics";
import MatchLineups from "./MatchLineups";

const MatchDetail = ({ show, onHide, match, toggleFavorite, isFavorite, onOpenRegistration }) => {
    const [activeTab, setActiveTab] = useState("EVENTS"); // Default to "EVENTS"

    if (!match) return null;

    const isUpcoming = match.status === "UPCOMING";

    const handleFavoriteClick = (type, item) => {
        if (toggleFavorite) {
            toggleFavorite(type, item); // Jeśli użytkownik jest zalogowany, wykonaj standardową akcję
        } else if (onOpenRegistration) {
            onHide(); // Zamknij obecny modal
            onOpenRegistration(); // Otwórz modal rejestracji
        }
    };

    const renderTabContent = () => {
        if (activeTab === "EVENTS") {
            return <MatchEvents match={match} />;
        } else if (activeTab === "STATISTICS") {
            return <MatchStatistics match={match} />;
        } else if (activeTab === "LINEUPS") {
            console.log("LINEUPS MATCH ID: " + match.id);
            return <MatchLineups matchId={match.id} />;
        }
        return <div>Coming soon...</div>;
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            dialogClassName="match-detail-modal custom-modal"
            contentClassName="match-detail-content"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="match-detail-header">
                        <img
                            src={`/assets/flags/${match.league.country.code}.svg`}
                            alt={match.league.country.name}
                            className="match-detail-flag"
                        />
                        <span>
                            {match.league.name} &gt; Round {match.round}
                        </span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="match-detail-body">
                    <div className="team-section">
                        <i
                            className={`bi ${
                                isFavorite && isFavorite("teams", match.homeTeam.id)
                                    ? "bi-star-fill text-warning"
                                    : "bi-star"
                            }`}
                            onClick={() => handleFavoriteClick("teams", match.homeTeam)}
                            style={{ cursor: "pointer", marginRight: "10px" }}
                        ></i>
                        <div className="team-info">
                            <TeamImage team={match.homeTeam} />
                            <div className="team-name">{match.homeTeam.name}</div>
                        </div>
                    </div>

                    <div className="match-info">
                        <div className="match-date">
                            {new Date(match.dateTime).toLocaleDateString("pl-PL")}{" "}
                            {new Date(match.dateTime).toLocaleTimeString("pl-PL", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                        <div className="match-score">
                            {isUpcoming ? (
                                <span className="match-vs">-</span>
                            ) : (
                                <span>
                                    {match.homeGoals} : {match.awayGoals}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="team-section">
                        <div className="team-info">
                            <TeamImage team={match.awayTeam} />
                            <div className="team-name">{match.awayTeam.name}</div>
                        </div>
                        <i
                            className={`bi ${
                                isFavorite && isFavorite("teams", match.awayTeam.id)
                                    ? "bi-star-fill text-warning"
                                    : "bi-star"
                            }`}
                            onClick={() => handleFavoriteClick("teams", match.awayTeam)}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                        ></i>
                    </div>
                </div>

                {/* Tab Buttons */}
                <ButtonGroup className="tab-buttons">
                    <Button
                        className={`custom-tab-button ${activeTab === "EVENTS" ? "active" : ""}`}
                        onClick={() => setActiveTab("EVENTS")}
                    >
                        Events
                    </Button>
                    <Button
                        className={`custom-tab-button ${activeTab === "STATISTICS" ? "active" : ""}`}
                        onClick={() => setActiveTab("STATISTICS")}
                    >
                        Statistics
                    </Button>
                    <Button
                        className={`custom-tab-button ${activeTab === "LINEUPS" ? "active" : ""}`}
                        onClick={() => setActiveTab("LINEUPS")}
                    >
                        Lineups
                    </Button>
                </ButtonGroup>

                {/* Tab Content */}
                <div className="tab-content">{renderTabContent()}</div>
            </Modal.Body>
        </Modal>
    );
};

export default MatchDetail;
