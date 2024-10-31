import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRefereeForm = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [file, setFile] = useState(null);
    const [importMode, setImportMode] = useState(false); // False = manual entry, True = import file


    // Funkcja do pobierania dzisiejszej daty w formacie YYYY-MM-DD
    //minimalny wiek sedziego to 25 (fullYear -25)
        const getTodayDate = () => {
            const today = new Date();
            const year = today.getFullYear()-25;
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Dodaje zero przed jednocyfrowym miesiącem
            const day = String(today.getDate()).padStart(2, '0'); // Dodaje zero przed jednocyfrowym dniem
            return `${year}-${month}-${day}`;
        };


    useEffect(() => {
        // Fetch countries from the backend
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(response => setCountries(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!importMode) {
            // Manual entry submission logic
            const refereeData = {
                firstName,
                lastName,
                dateOfBirth,
                countryName: selectedCountry // Using country name to identify country
            };

            axios.post('http://localhost:8080/api/referees/add', refereeData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Referee added successfully');
                    setFirstName('');
                    setLastName('');
                    setDateOfBirth('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding referee:', error);
                    alert('Failed to add referee');
                });
        } else {
            // File import logic
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', file.type.includes('json') ? 'json' : 'csv');

            axios.post('http://localhost:8080/api/referees/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Referees imported successfully');
                    setFile(null);
                })
                .catch(error => {
                    console.error('Error importing referees:', error);
                    alert('Failed to import referees');
                });
        }
    };

    return (
        <div>
            <h2>{importMode ? 'Import Referees' : 'Add Referee'}</h2>
            <div>
                <button onClick={() => setImportMode(false)}>Manual Entry</button>
                <button onClick={() => setImportMode(true)}>Import from File</button>
            </div>
            <form onSubmit={handleSubmit}>
                {!importMode ? (
                    <>
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                max={getTodayDate()}
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Country</label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                ) : (
                    <div>
                        <label>Import File</label>
                        <input
                            type="file"
                            accept=".json,.csv"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                )}
                <button type="submit">{importMode ? 'Import Referees' : 'Add Referee'}</button>
            </form>
        </div>
    );
};

export default AddRefereeForm;
