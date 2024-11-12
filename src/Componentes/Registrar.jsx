import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const Registrar = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Función para manejar el registro
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombre,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario registrado exitosamente');
                navigate('/login');
            } else {
                setErrorMessage(data.message || 'Error al registrar usuario');
            }
        } catch (error) {
            setErrorMessage('Error al conectar con el servidor');
        }
    };

    const LoginClick = () => {
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <h1 style={styles.title}>Únete a Nosotros</h1>
                <div style={styles.carouselContainer}>
                    <Carousel 
                        autoPlay 
                        infiniteLoop 
                        showThumbs={false} 
                        showStatus={false} 
                        showArrows={false} 
                        interval={2000}
                    >
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/5807/5807871.png" alt="Logo 1" style={styles.logo} />
                            <p style={styles.carouselText}>Organiza tus proyectos con facilidad y claridad.</p>
                        </div>
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/2637/2637283.png" alt="Logo 2" style={styles.logo} />
                            <p style={styles.carouselText}>Monitorea el progreso de cada actividad en tiempo real.</p>
                        </div>
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/4388/4388337.png" alt="Logo 3" style={styles.logo} />
                            <p style={styles.carouselText}>Optimiza recursos y maximiza la eficiencia de tu equipo.</p>
                        </div>
                    </Carousel>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.formContainer}>
                    <h2 style={styles.registerTitle}>Regístrate</h2>
                    <p style={styles.welcomeText}>Crea una cuenta llenando los datos requeridos a continuación.</p>
                    <input
                        type="text"
                        placeholder="Nombres"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Apellidos"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="DNI"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                    />
                    {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
                    <button onClick={handleRegister} style={styles.registerButton}>Registrar</button>
                    <div style={styles.linkContainer}>
                        <p>¿Ya tienes una cuenta? <a href="#" onClick={LoginClick} style={styles.link}>Inicia sesión</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos en línea restaurados
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#007BFF',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
    },
    carouselContainer: {
        marginBottom: '20px',
        width: '80%',
        textAlign: 'center',
    },
    logo: {
        width: '100%',
        height: 'auto',
        maxHeight: '200px',
        objectFit: 'contain',
    },
    carouselText: {
        color: '#FFFFFF',
        fontSize: '1.3rem',
        marginTop: '10px',
        marginBottom: '35px',
        padding: '0 15px',
        textAlign: 'center',
    },
    rightPanel: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#F7F9FB',
    },
    formContainer: {
        width: '100%',
        maxWidth: '350px',
        backgroundColor: '#FFF',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    registerButton: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    errorText: {
        color: 'red',
        marginBottom: '10px',
    },
    linkContainer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    link: {
        color: '#007BFF',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
};

export default Registrar;
