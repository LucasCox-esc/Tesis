import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';

const BackgroundRectangle = ({ onImageChange }) => {
    const predefinedImages = [
        'https://i.ibb.co/j5MThZq/01descarga.png',
        'https://i.ibb.co/svqYsdP/02descarga.png',
        'https://i.ibb.co/WxbCMk9/03descarga.png',
        'https://images8.alphacoders.com/135/thumb-1920-1358524.png',
    ];

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [circleImage, setCircleImage] = useState(null);
    const fileInputRef = useRef(null);
    const circleInputRef = useRef(null);

    useEffect(() => {
        const storedBackgroundImage = localStorage.getItem('backgroundImage');
        const storedCircleImage = localStorage.getItem('circleImage');

        if (storedBackgroundImage) {
            setBackgroundImage(storedBackgroundImage);
        } else {
            const randomIndex = Math.floor(Math.random() * predefinedImages.length);
            setBackgroundImage(predefinedImages[randomIndex]);
        }

        if (storedCircleImage) {
            setCircleImage(storedCircleImage);
        }
    }, []);

    useEffect(() => {
        if (backgroundImage) {
            localStorage.setItem('backgroundImage', backgroundImage);
        } else {
            localStorage.removeItem('backgroundImage');
        }
    }, [backgroundImage]);

    useEffect(() => {
        if (circleImage) {
            localStorage.setItem('circleImage', circleImage);
        } else {
            localStorage.removeItem('circleImage');
        }
    }, [circleImage]);

    const handleBackgroundImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBackgroundImage(reader.result);
                if (onImageChange) onImageChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCircleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCircleImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteBackgroundImage = () => {
        const remainingImages = predefinedImages.filter(
            (image) => image !== backgroundImage
        );
        const randomIndex = Math.floor(Math.random() * remainingImages.length);
        setBackgroundImage(remainingImages[randomIndex]);
    };

    const handleDeleteCircleImage = () => {
        setCircleImage(null);
    };

    return (
        <div
            style={{
                backgroundColor: '#333',
                width: '100%',
                height: '35vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${backgroundImage})`,
                position: 'relative',
            }}
        >
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-secondary"
                aria-label="Cambiar fondo del rectángulo"
                onClick={() => fileInputRef.current.click()}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                }}
            />
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleBackgroundImageChange}
            />

            {backgroundImage && (
                <Button
                    icon="pi pi-replay"
                    className="p-button-rounded p-button-danger"
                    aria-label="Reiniciar fondo"
                    onClick={handleDeleteBackgroundImage}
                    style={{
                        position: 'absolute',
                        top: '60px',
                        right: '10px',
                    }}
                />
            )}

            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid white',
                    backgroundColor: 'white',
                }}
            >
                {circleImage && (
                    <img
                        src={circleImage}
                        alt="Fondo del círculo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-secondary"
                    aria-label="Cambiar fondo del círculo"
                    onClick={() => circleInputRef.current.click()}
                    style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                    }}
                />
                <input
                    ref={circleInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleCircleImageChange}
                />

                {circleImage && (
                    <Button
                        label="Eliminar círculo"
                        className="p-button-danger"
                        onClick={handleDeleteCircleImage}
                        style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: '10px',
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default BackgroundRectangle;
