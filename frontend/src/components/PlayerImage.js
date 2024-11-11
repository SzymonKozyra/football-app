import React, { useState, useEffect } from 'react';

const PlayerImage = ({ player }) => {
    const [imageUrl, setImageUrl] = useState(`http://localhost:8080/img/player/player_${player.id}.jpg`);

    useEffect(() => {
        // Funkcja do sprawdzania, czy plik istnieje
        const checkImageExists = async (url) => {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;
            } catch (error) {
                return false;
            }
        };

        // Sprawdź najpierw JPG, a jeśli nie ma, użyj PNG
        const verifyImage = async () => {
            const jpgUrl = `http://localhost:8080/img/player/player_${player.id}.jpg`;
            const pngUrl = `http://localhost:8080/img/player/player_${player.id}.png`;

            const jpgExists = await checkImageExists(jpgUrl);
            if (jpgExists) {
                setImageUrl(jpgUrl);
            } else {
                const pngExists = await checkImageExists(pngUrl);
                if (pngExists) {
                    setImageUrl(pngUrl);
                } else {
                    // Opcjonalnie: Ustaw domyślny obraz, jeśli żaden nie istnieje
                    setImageUrl('http://localhost:8080/img/player/default-player.png');
                }
            }
        };

        verifyImage();
    }, [player.id]);

    return (
        <img
            src={imageUrl}
            alt={`${player.firstName} ${player.lastName}`}
            className="player-picture"
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
        />
    );
};

export default PlayerImage;
