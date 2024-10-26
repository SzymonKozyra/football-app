import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RefereeSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [referees, setReferees] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedReferee, setSelectedReferee] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        countryName: ''
    });

    useEffect(() => {
        // Fetch available countries
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(response => setCountries(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/referees/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setReferees(response.data))
            .catch(error => console.error('Error fetching referees:', error));
    };

    const handleEditClick = (referee) => {
        setSelectedReferee(referee);
        setEditData({
            firstName: referee.firstName,
            lastName: referee.lastName,
            dateOfBirth: referee.dateOfBirth,
            countryName: referee.country.name
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const updatedData = {
            ...editData,
            countryName: editData.countryName // Sending country name, backend will find country ID
        };

        axios.put(`http://localhost:8080/api/referees/${selectedReferee.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Referee updated successfully');
                setSelectedReferee(null);
            })
            .catch(error => {
                console.error('Error updating referee:', error);
                alert('Failed to update referee');
            });
    };

    return (
        <div>
            <h2>Search Referee</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter first or last name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {referees.length > 0 && (
                <div>
                    <h3>Referees found:</h3>
                    <ul>
                        {referees.map(referee => (
                            <li key={referee.id}>
                                {referee.firstName} {referee.lastName} - {referee.country.name}
                                <button onClick={() => handleEditClick(referee)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedReferee && (
                <div>
                    <h3>Edit Referee: {selectedReferee.firstName} {selectedReferee.lastName}</h3>
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

export default RefereeSearchAndEditForm;
