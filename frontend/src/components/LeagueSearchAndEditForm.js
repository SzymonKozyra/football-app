import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const LeagueSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [countries, setCountries] = useState([]); // Lista krajów
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        countryName: '' // Korzystamy z nazwy kraju zamiast countryId
    });

    useEffect(() => {
        // Pobierz dostępne kraje z backendu
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/leagues/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }  // Autoryzacja przez JWT token
        })
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
            });
    };

    const handleEditClick = (league) => {
        setSelectedLeague(league);
        setEditData({
            name: league.name,
            countryName: league.country.name // Używamy nazwy kraju
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        // Znajdź countryId na podstawie nazwy kraju
        const selectedCountry = countries.find(country => country.name === editData.countryName);
        const countryId = selectedCountry ? selectedCountry.id : null;

        const updatedData = {
            ...editData,
            countryId // Zamieniamy countryName na countryId dla wysłania do backendu
        };

        axios.put(`http://localhost:8080/api/leagues/${selectedLeague.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }  // Autoryzacja przez JWT token
        })
            .then(response => {
                alert('League updated successfully');
                setSelectedLeague(null); // Wyczyść po udanej aktualizacji
            })
            .catch(error => {
                console.error('Error updating league:', error);
                alert('Failed to update league');
            });
    };

    return (
        <div className="form-container">
            <h1>Search League</h1>
            <form onSubmit={handleSearch} className="form-container">
                <input
                    type="text"
                    placeholder="Enter league name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                />
                <button type="submit">Search</button>
            </form>

            {leagues.length > 0 && (
                <div>
                    <h3>Leagues found:</h3>
                    <ul className="league-list">
                        {leagues.map(league => (
                            <li key={league.id}>
                                <strong>ID:</strong> {league.id}<br />
                                <strong>Name:</strong> {league.name}<br />
                                <strong>Country:</strong> {league.country.name}<br />
                                <button onClick={() => handleEditClick(league)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedLeague && (
                <div className="form-container">
                    <h3>Edit League: {selectedLeague.name}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>League Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Country</label>
                            <select
                                value={editData.countryName}
                                onChange={(e) => setEditData({ ...editData, countryName: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LeagueSearchAndEditForm;
