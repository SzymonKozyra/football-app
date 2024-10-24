import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoachSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [coaches, setCoaches] = useState([]);
    const [countries, setCountries] = useState([]); // List of countries
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        countryName: '' // Using countryName instead of countryId
    });

    useEffect(() => {
        // Fetch available countries from the backend
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

        // Fetch coaches based on the search query
        axios.get(`http://localhost:8080/api/coaches/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }  // Add JWT token for authorization
        })
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching coaches:', error);
            });
    };

    const handleEditClick = (coach) => {
        setSelectedCoach(coach);
        setEditData({
            firstName: coach.firstName,
            lastName: coach.lastName,
            dateOfBirth: coach.dateOfBirth,
            nickname: coach.nickname,
            countryName: coach.country.name // Use country name for display
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        // Send updated coach data to the backend
        const updatedData = {
            ...editData,
            countryName: editData.countryName // Backend will find ID based on countryName
        };

        axios.put(`http://localhost:8080/api/coaches/${selectedCoach.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }  // JWT token for authorization
        })
            .then(response => {
                alert('Coach updated successfully');
                setSelectedCoach(null); // Clear selected coach after update
            })
            .catch(error => {
                console.error('Error updating coach:', error);
                alert('Failed to update coach');
            });
    };

    return (
        <div>
            <h2>Search Coach</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter first or last name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {coaches.length > 0 && (
                <div>
                    <h3>Coaches found:</h3>
                    <ul>
                        {coaches.map(coach => (
                            <li key={coach.id}>
                                {/* Displaying all relevant coach information */}
                                {coach.id}: {coach.firstName} {coach.lastName} ({coach.nickname}), Country: {coach.country.name}
                                <button onClick={() => handleEditClick(coach)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedCoach && (
                <div>
                    <h3>Edit Coach: {selectedCoach.firstName} {selectedCoach.lastName}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={editData.firstName}
                                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={editData.lastName}
                                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Nickname</label>
                            <input
                                type="text"
                                value={editData.nickname}
                                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
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

export default CoachSearchAndEditForm;
