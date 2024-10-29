import React, { useState } from 'react';
import axios from 'axios';

const PlayerImportForm = () => {
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState("csv");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileTypeChange = (e) => {
        setFileType(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", fileType);

        axios.post('http://localhost:8080/api/players/import', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(response => {
                alert("Players imported successfully");
            })
            .catch(error => {
                console.error("Error importing players:", error);
                alert("Failed to import players");
            });
    };

    return (
        <div>
            <h2>Import Players</h2>
            <form onSubmit={handleSubmit}>
                <label>Select File:</label>
                <input type="file" onChange={handleFileChange} />

                <label>File Type:</label>
                <select value={fileType} onChange={handleFileTypeChange}>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                </select>

                <button type="submit">Import Players</button>
            </form>
        </div>
    );
};

export default PlayerImportForm;
