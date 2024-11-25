import React from "react";
import { Modal } from "react-bootstrap";
import TeamImage from "./TeamImage"; // Używamy komponentu TeamImage dla herbów

import "./MatchDetail.css"; // Dodajemy plik CSS dla stylizacji

const MatchDetail = ({ show, onHide, match, toggleFavorite, isFavorite }) => {
    if (!match) return null;

    const isUpcoming = match.status === "UPCOMING";

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="custom-modal" // Klasa dla niestandardowego stylu
            contentClassName="custom-modal-content" // Opcjonalna klasa dla zawartości

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
                    {/* Team 1 Section */}
                    <div className="team-section">
                        <i
                            className={`bi ${
                                isFavorite("teams", match.homeTeam.id) ? "bi-star-fill text-warning" : "bi-star"
                            }`}
                            onClick={() => toggleFavorite("teams", match.homeTeam)}
                            style={{ cursor: "pointer", marginRight: "10px" }}
                        ></i>
                        <div className="team-info">
                            <TeamImage team={match.homeTeam} />
                            <div className="team-name">{match.homeTeam.name}</div>
                        </div>
                    </div>

                    {/* Match Info Section */}
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

                    {/* Team 2 Section */}
                    <div className="team-section">
                        <div className="team-info">
                            <TeamImage team={match.awayTeam} />
                            <div className="team-name">{match.awayTeam.name}</div>
                        </div>
                        <i
                            className={`bi ${
                                isFavorite("teams", match.awayTeam.id) ? "bi-star-fill text-warning" : "bi-star"
                            }`}
                            onClick={() => toggleFavorite("teams", match.awayTeam)}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                        ></i>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    );
};

export default MatchDetail;
