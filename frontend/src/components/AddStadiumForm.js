import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStadiumForm = () => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [stadiumName, setStadiumName] = useState('');
    const [stadiumCapacity, setStadiumCapacity] = useState('');
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState(null);
    const [manualEntry, setManualEntry] = useState(true); // Default to manual entry

    useEffect(() => {
        // Fetch countries from the backend
        axios.get('http://localhost:8080/api/countries')
            .then(response => setCountries(response.data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setSelectedCountry(countryId);

        // Fetch cities based on selected country
        axios.get(`http://localhost:8080/api/cities/by-country/${countryId}`)
            .then(response => setCities(response.data))
            .catch(error => console.error("Error fetching cities:", error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry && stadiumCapacity <= 0) {
            alert('Stadium capacity must be greater than 0');
            return;
        }

        if (manualEntry) {
            // Manual entry submission logic
            const stadiumData = {
                name: stadiumName,
                capacity: stadiumCapacity,
                cityId: selectedCity
            };

            axios.post('http://localhost:8080/api/stadiums/add', stadiumData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Stadium added successfully');
                    // Reset form fields
                    setStadiumName('');
                    setStadiumCapacity('');
                    setSelectedCountry('');
                    setSelectedCity('');
                })
                .catch(error => {
                    console.error('Error adding stadium:', error);
                    alert('Failed to add stadium');
                });
        } else {
            // File import logic
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/stadiums/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Stadiums imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing stadiums:', error);
                    alert('Failed to import stadiums');
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <input
                        type="radio"
                        value="manual"
                        checked={manualEntry}
                        onChange={() => setManualEntry(true)}
                    />
                    Manual Entry
                </label>
                <label>`
                    <input
                        type="radio"
                        value="import"
                        checked={!manualEntry}
                        onChange={() => setManualEntry(false)}
                    />
                    Import from File
                </label>
            </div>

            {manualEntry ? (
                <>
                    <div>
                        <label>Country Name</label>
                        <input
                            type="text"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>City Name</label>
                        <input
                            type="text"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Stadium Name</label>
                        <input
                            type="text"
                            value={stadiumName}
                            onChange={(e) => setStadiumName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Stadium Capacity</label>
                        <input
                            type="number"
                            value={stadiumCapacity}
                            onChange={(e) => setStadiumCapacity(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label>File Type</label>
                        <select value={fileType} onChange={(e) => setFileType(e.target.value)} required>
                            <option value="">Select file type</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <div>
                        <label>Import Stadiums (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">Add Stadium</button>
        </form>
    );
};

export default AddStadiumForm;
