import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RealHome = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Cargar proyectos desde el almacenamiento local al iniciar
    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(savedProjects);
    }, []);

    // Guardar proyectos en el almacenamiento local cuando cambian
    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const goToProject = () => {
        navigate('/home');
    };

    const handleLogout = () => {
        navigate('/inicio'); // Redirige a "Inicio.jsx"
    };

    const handleAddProject = () => {
        if (projectName.trim() !== "") {
            const newProjects = [...projects, projectName];
            setProjects(newProjects);
            setProjectName('');
            setShowPopup(false);
        }
    };

    const handleDeleteProject = (index) => {
        setDeleteIndex(index);
        setConfirmDelete(true); // Muestra el panel de confirmación
    };

    const confirmDeleteProject = () => {
        const updatedProjects = projects.filter((_, i) => i !== deleteIndex);
        setProjects(updatedProjects);
        setConfirmDelete(false); // Cierra el panel de confirmación
    };

    const handleEditProject = () => {
        navigate('/home'); // Redirige a "Home.jsx"
    };

    return (
        <div style={styles.container}>
            {/* Barra lateral de navegación */}
            <div style={styles.sidebar}>
                <div style={styles.profileCircle}>
                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/1256/1256650.png" 
                        alt="User Profile" 
                        style={styles.profileImage} 
                    />
                </div>
                <div style={styles.navItemContainer}>
                    <img src="https://cdn-icons-png.flaticon.com/128/1946/1946488.png" alt="Home Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Home</p>
                </div>
                <div style={styles.navItemContainer}>
                    <img src="https://cdn-icons-png.flaticon.com/128/622/622669.png" alt="Search Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Buscar</p>
                </div>
                <div style={styles.navItemContainer}>
                    <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="Roles Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Roles</p>
                </div>
             {/* Espaciador flexible */}
             <div style={{ flex: 1 }}></div>
                
                <div style={styles.navItemContainer} onClick={handleLogout}>
                    <img src="https://cdn-icons-png.flaticon.com/128/1828/1828490.png" alt="Logout Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Cerrar Sesión</p>
                </div>
            </div>

            {/* Contenido principal */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Gestión de Proyectos</h1>
                    <button style={styles.addButton} onClick={() => setShowPopup(true)}>+ Nuevo Proyecto</button>
                </div>
                
                <div style={styles.projectGrid}>
                    {projects.map((name, index) => (
                        <div key={index} style={styles.projectCard}>
                            <div style={styles.projectIconContainer}>
                                <img src="https://cdn-icons-png.flaticon.com/128/8162/8162180.png" alt="Project Icon" style={styles.projectIcon} />
                            </div>
                            <p style={styles.projectText}>{name}</p>
                            <div style={styles.cardButtons}>
                                <button style={styles.iconButton} onClick={handleEditProject}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/3838/3838756.png" alt="Edit" style={styles.icon} />
                                </button>
                                <button style={styles.iconButton} onClick={() => handleDeleteProject(index)}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711573.png" alt="Delete" style={styles.icon} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Popup de agregar proyecto */}
            {showPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2 style={styles.popupTitle}>Crear Proyecto</h2>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Nombre del proyecto"
                            style={styles.input}
                        />
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={handleAddProject}>Agregar</button>
                            <button style={styles.closeButton} onClick={() => setShowPopup(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Panel de confirmación de eliminación */}
            {confirmDelete && (
                <div style={styles.popupOverlay}>
                    <div style={styles.confirmPopup}>
                        <h3 style={styles.confirmTitle}>¿Estás seguro de que deseas eliminar este proyecto?</h3>
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={confirmDeleteProject}>Sí, Eliminar</button>
                            <button style={styles.closeButton} onClick={() => setConfirmDelete(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f3f6f9',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#007BFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0',
        color: '#FFF',
        boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
    },
    profileCircle: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#FFF',
        marginBottom: '30px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    navItemContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '15px 0',
        cursor: 'pointer',
        color: '#FFF',
    },
    navIcon: {
        width: '24px',
        height: '24px',
    },
    navItem: {
        fontWeight: '600',
        fontSize: 'rem',
        color: '#FFF',
        transition: 'color 0.3s ease',
    },
    mainContent: {
        flex: 1,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f3f6f9',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '2.2rem',
        color: '#333',
        fontWeight: '700',
    },
    addButton: {
        padding: '12px 24px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
        transition: 'all 0.3s ease',
    },
    projectGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
    },
    projectCard: {
        background: 'linear-gradient(145deg, #007BFF, #5DADE2)',
        padding: '25px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 123, 255, 0.2)',
        position: 'relative',
    },
    projectIconContainer: {
        width: '60px',
        height: '60px',
        backgroundColor: '#FFF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px',
    },
    projectIcon: {
        width: '50%',
        height: '50%',
    },
    projectText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: '10px',
    },
    cardButtons: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
    },
    iconButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '30px',
        height: '30px',
    },
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: '#FFF',
        padding: '25px',
        borderRadius: '12px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    },
    confirmPopup: {
        backgroundColor: '#FFF',
        padding: '20px',
        borderRadius: '10px',
        width: '320px',
        textAlign: 'center',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    },
    confirmTitle: {
        fontSize: '1.2rem',
        color: '#333',
        fontWeight: '600',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '15px 0',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
    },
    popupButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
    },
    popupButton: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        flex: 1,
        marginRight: '10px',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
        transition: 'background-color 0.3s',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: '#FFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        flex: 1,
        boxShadow: '0 4px 12px rgba(217, 83, 79, 0.3)',
    },
};

export default RealHome;
