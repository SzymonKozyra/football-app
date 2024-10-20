import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLeagueForm = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [leagueName, setLeagueName] = useState('');
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState(null);
    const [manualEntry, setManualEntry] = useState(true); // Default to manual entry

    useEffect(() => {
        // Fetch countries from the backend
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
            // Manual entry submission logic
            const leagueData = {
                name: leagueName,
                countryName: selectedCountry
            };

            axios.post('http://localhost:8080/api/leagues/add', leagueData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('League added successfully');
                    // Reset form fields
                    setLeagueName('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding league:', error);
                    alert('Failed to add league');
                });
        } else {
            // File import logic
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/leagues/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Leagues imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing leagues:', error);
                    alert('Failed to import leagues');
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
                        <label>Country Name</label>
                        <input
                            type="text"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>League Name</label>
                        <input
                            type="text"
                            value={leagueName}
                            onChange={(e) => setLeagueName(e.target.value)}
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
                        <label>Import Leagues (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">Add League</button>
        </form>
    );
};

export default AddLeagueForm;
