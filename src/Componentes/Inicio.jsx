import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Inicio.css'

export const Inicio = () => {
    const navigate = useNavigate();

    const LoginClick = () => {
        navigate('/login');
    };

    const RegistrarClick = () => {
        navigate('/registrar');
    };

    return (
        <div style={styles.container}>
            {/* Panel izquierdo con fondo celeste y diseño visual */}
            <div style={styles.leftPanel}>
            <h1 style={styles.title}>Gestiona tus actividades</h1>

                <div style={styles.carouselContainer}>
                    <Carousel 
                        autoPlay 
                        infiniteLoop 
                        showThumbs={false} 
                        showStatus={false} 
                        showArrows={false} 
                        interval={3000}
                    >
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/2172/2172479.png" alt="Logo 1" style={styles.logo} />
                            <p style={styles.carouselText}>Organiza tus proyectos con facilidad y claridad.</p>
                        </div>
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/2274/2274923.png" alt="Logo 2" style={styles.logo} />
                            <p style={styles.carouselText}>Monitorea el progreso de cada actividad en tiempo real.</p>
                        </div>
                        <div>
                            <img src="https://cdn-icons-png.flaticon.com/512/1129/1129445.png" alt="Logo 3" style={styles.logo} />
                            <p style={styles.carouselText}>Optimiza recursos y maximiza la eficiencia de tu equipo.</p>
                        </div>
                    </Carousel>
                </div>
               
            </div>

            {/* Panel derecho con formulario de inicio de sesión */}
            <div style={styles.rightPanel}>
                <div style={styles.formContainer}>
                    <h2 style={styles.loginTitle}>Bienvenido</h2>
                    <p style={styles.welcomeText}>Elige una opción para continuar.</p>
                    <button onClick={LoginClick} style={styles.optionButton}>
                        Iniciar sesión
                    </button>
                    <button onClick={RegistrarClick} style={styles.optionButton}>
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

// Estilos en línea con diseño y paleta de colores
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw', // Asegura que ocupe toda la pantalla sin margen
        overflow: 'hidden', // Evita el desplazamiento adicional
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#007BFF', // Celeste
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
    title: {
        fontSize: '2.5rem',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: '1.4',
        marginBottom: '20px',
    },
    description: {
        fontSize: '1.1rem',
        maxWidth: '300px',
        textAlign: 'center',
        marginBottom: '30px',
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
    loginTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
    },
    welcomeText: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '25px',
    },
    optionButton: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: '#007BFF', // Celeste
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
};

export default Inicio;
