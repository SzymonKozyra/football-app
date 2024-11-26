// TeamImage.js
import React, { useState, useEffect } from 'react';

const TeamImageVerySmall = ({ team }) => {
    const [imageUrl, setImageUrl] = useState(`http://localhost:8080/img/team/team_${team.id}.jpg`);

    useEffect(() => {
        // Function to check if an image exists
        const checkImageExists = async (url) => {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;
            } catch (error) {
                return false;
            }
        };

        // Verify if JPG or PNG image exists
        const verifyImage = async () => {
            const jpgUrl = `http://localhost:8080/img/team/team_${team.id}.jpg`;
            const pngUrl = `http://localhost:8080/img/team/team_${team.id}.png`;

            const jpgExists = await checkImageExists(jpgUrl);
            if (jpgExists) {
                setImageUrl(jpgUrl);
            } else {
                const pngExists = await checkImageExists(pngUrl);
                if (pngExists) {
                    setImageUrl(pngUrl);
                } else {
                    // Optionally set a default image if none exist
                    setImageUrl('http://localhost:8080/img/team/default-team.png');
                }
            }
        };

        verifyImage();
    }, [team.id]);

    return (
        <img
            src={imageUrl}
            alt={team.name}
            className="team-picture"
            style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }}
        />
    );
};

export default TeamImageVerySmall;
