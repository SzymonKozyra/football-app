import React, { useState } from 'react';
import axios from 'axios';

const AddCoachForm = () => {
    const [manualEntry, setManualEntry] = useState(true);
    const [coachData, setCoachData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        countryName: ''
    });
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }
        if (manualEntry) {
            axios.post('http://localhost:8080/api/coaches/add', coachData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => alert('Coach added successfully'))
                .catch(error => console.error('Error adding coach:', error));
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/coaches/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => alert('Coaches imported successfully'))
                .catch(error => console.error('Error importing coaches:', error));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <input type="radio" value="manual" checked={manualEntry} onChange={() => setManualEntry(true)} />
                    Manual Entry
                </label>
                <label>
                    <input type="radio" value="import" checked={!manualEntry} onChange={() => setManualEntry(false)} />
                    Import from File
                </label>
            </div>

            {manualEntry ? (
                <div>
                    <input type="text" placeholder="First Name" value={coachData.firstName} onChange={e => setCoachData({ ...coachData, firstName: e.target.value })} required />
                    <input type="text" placeholder="Last Name" value={coachData.lastName} onChange={e => setCoachData({ ...coachData, lastName: e.target.value })} required />
                    <input type="date" placeholder="Date of Birth" value={coachData.dateOfBirth} onChange={e => setCoachData({ ...coachData, dateOfBirth: e.target.value })} required />
                    <input type="text" placeholder="Nickname" value={coachData.nickname} onChange={e => setCoachData({ ...coachData, nickname: e.target.value })} />
                    <input type="text" placeholder="Country Name" value={coachData.countryName} onChange={e => setCoachData({ ...coachData, countryName: e.target.value })} required />
                </div>
            ) : (
                <div>
                    <select value={fileType} onChange={e => setFileType(e.target.value)} required>
                        <option value="">Select File Type</option>
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                    </select>
                    <input type="file" onChange={e => setFile(e.target.files[0])} required />
                </div>
            )}

            <button type="submit">Submit</button>
        </form>
    );
};

export default AddCoachForm;
