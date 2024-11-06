import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const Registrar = () => {
    const navigate = useNavigate();

    const LoginClick = () => {
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Panel izquierdo con fondo celeste y diseño visual */}
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

            {/* Panel derecho con formulario de registro */}
            <div style={styles.rightPanel}>
                <div style={styles.formContainer}>
                    <h2 style={styles.registerTitle}>Regístrate</h2>
                    <p style={styles.welcomeText}>
                        Crea una cuenta llenando los datos requeridos a continuación.
                    </p>
                    <input type="text" placeholder="Nombres" style={styles.input} />
                    <input type="text" placeholder="Apellidos" style={styles.input} />
                    <input type="text" placeholder="DNI" style={styles.input} />
                    <input type="email" placeholder="Correo" style={styles.input} />
                    <input type="password" placeholder="Contraseña" style={styles.input} />
                    <input type="password" placeholder="Confirmar Contraseña" style={styles.input} />
                    <button onClick={LoginClick} style={styles.registerButton}>
                        Registrar
                    </button>
                    <div style={styles.linkContainer}>
                        <p>¿Ya tienes una cuenta? <a href="#" onClick={LoginClick} style={styles.link}>Inicia sesión</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos en línea con paleta de colores celeste, negro y blanco
const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw', // Asegura que ocupe todo el ancho de la ventana
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
        backgroundColor: '#F7F9FB', // Fondo gris claro
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
    registerTitle: {
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
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box',
    },
    registerButton: {
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
    linkContainer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    link: {
        color: '#007BFF', // Celeste
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'color 0.3s',
    },
};

export default Registrar;
