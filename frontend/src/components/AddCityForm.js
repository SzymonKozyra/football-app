import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCityForm = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cityName, setCityName] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [manualEntry, setManualEntry] = useState(true);

    useEffect(() => {
        // Fetch list of countries
        axios.get('http://localhost:8080/api/countries')
            .then(response => setCountries(response.data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            // Manual entry logic
            const cityData = {
                name: cityName,
                country: { name: selectedCountry }
            };

            axios.post('http://localhost:8080/api/cities/add', cityData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('City added successfully');
                    setCityName('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding city:', error);
                    alert('Failed to add city');
                });
        } else {
            // File import logic
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/cities/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Cities imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing cities:', error);
                    alert('Failed to import cities');
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
                <label>
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
                        <label>Country</label>
                        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required>
                            <option value="">Select a country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>City Name</label>
                        <input
                            type="text"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            required
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
                        <label>Import Cities (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">Submit</button>
        </form>
    );
};

export default AddCityForm;
