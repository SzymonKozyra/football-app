import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        axios.get('http://localhost:8080/api/countries')
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
        <div>
            <h2>Search League</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter league name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {leagues.length > 0 && (
                <div>
                    <h3>Leagues found:</h3>
                    <ul>
                        {leagues.map(league => (
                            <li key={league.id}>
                                {league.name} ({league.country.name})
                                <button onClick={() => handleEditClick(league)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedLeague && (
                <div>
                    <h3>Edit League: {selectedLeague.name}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>League Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Country</label>
                            <select
                                value={editData.countryName}
                                onChange={(e) => setEditData({ ...editData, countryName: e.target.value })}
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
