import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddCoachForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nickname, setNickname] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [manualEntry, setManualEntry] = useState(true);

    useEffect(() => {
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
            const coachData = {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                nickname: nickname,
                country: { name: selectedCountry }
            };

            axios.post('http://localhost:8080/api/coaches/add', coachData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Coach added successfully');
                    setFirstName('');
                    setLastName('');
                    setDateOfBirth('');
                    setNickname('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding coach:', error);
                    alert('Failed to add coach');
                });
        } else {
            // File import logic
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/coaches/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Coaches imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing coaches:', error);
                    alert('Failed to import coaches');
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Coach</h1>
            <div className="radio-group">
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
                        <label>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={e => setDateOfBirth(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                        />
                    </div>

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
                </>
            ) : (
                <>
                    <div>
                        <label>File Type</label>
                        <select value={fileType} onChange={e => setFileType(e.target.value)} required>
                            <option value="">Select File Type</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <div>
                        <label>Import Coaches (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={e => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">Add Coach</button>
        </form>
    );
};

export default AddCoachForm;
