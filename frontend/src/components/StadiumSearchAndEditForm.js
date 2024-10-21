import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StadiumSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [stadiums, setStadiums] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        capacity: '',
        cityName: '',
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

        // Fetch stadiums matching the search query
        axios.get(`http://localhost:8080/api/stadiums/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` } // Use JWT token for authorization
        })
            .then(response => {
                setStadiums(response.data);
            })
            .catch(error => {
                console.error('Error fetching stadiums:', error);
            });
    };

    const handleEditClick = (stadium) => {
        setSelectedStadium(stadium);
        setEditData({
            name: stadium.name,
            capacity: stadium.capacity,
            cityName: stadium.city.name,
            countryName: stadium.city.country.name // Use country name for display
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        // Find the countryId based on the selected country name
        const selectedCountry = countries.find(country => country.name === editData.countryName);
        const countryId = selectedCountry ? selectedCountry.id : null;

        const updatedData = {
            ...editData,
            countryId // Replace countryName with countryId for submission
        };

        // Send the updated stadium data to the backend
        axios.put(`http://localhost:8080/api/stadiums/${selectedStadium.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` } // Use JWT token for authorization
        })
            .then(response => {
                alert('Stadium updated successfully');
                setSelectedStadium(null); // Clear selected stadium after update
            })
            .catch(error => {
                console.error('Error updating stadium:', error);
                alert('Failed to update stadium');
            });
    };

    return (
        <div>
            <h2>Search Stadium</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter stadium name or city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {stadiums.length > 0 && (
                <div>
                    <h3>Stadiums found:</h3>
                    <ul>
                        {stadiums.map(stadium => (
                            <li key={stadium.id}>
                                {stadium.name} ({stadium.city.name}, {stadium.city.country.name})
                                <button onClick={() => handleEditClick(stadium)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedStadium && (
                <div>
                    <h3>Edit Stadium: {selectedStadium.name}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Capacity</label>
                            <input
                                type="number"
                                value={editData.capacity}
                                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>City</label>
                            <input
                                type="text"
                                value={editData.cityName}
                                onChange={(e) => setEditData({ ...editData, cityName: e.target.value })}
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

export default StadiumSearchAndEditForm;
