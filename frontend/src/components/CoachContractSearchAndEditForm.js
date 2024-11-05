import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const CoachContractSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [editData, setEditData] = useState({
        startDate: '',
        endDate: '',
        salary: '',
        transferFee: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get(`/api/coach-contracts/search?query=${searchQuery}`)
            .then(res => setContracts(res.data))
            .catch(err => console.error("Failed to fetch contracts:", err));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`/api/coach-contracts/${selectedContract.id}`, editData)
            .then(() => alert("Contract updated successfully"))
            .catch(err => console.error("Failed to update contract:", err));
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                {/* Pole wyszukiwania */}
            </form>
            {contracts.map(contract => (
                <div key={contract.id}>
                    {/* Lista kontraktów */}
                </div>
            ))}
            {selectedContract && (
                <form onSubmit={handleEditSubmit}>
                    {/* Formularz edycji */}
                </form>
            )}
        </div>
    );
};

export default CoachContractSearchAndEditForm;



