import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RealHome = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState(''); 
    const [projectImage, setProjectImage] = useState(null);
    const [projectImageName, setProjectImageName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Fetch projects from API on component mount
    const fetchProjects = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3000/api/proyectos", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data); // Set projects from API response
            } else {
                console.error("Error fetching projects:", response.statusText);
            }
        } catch (error) {
            console.error("Fetch request error:", error.message);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const goToProject = () => {
        navigate('/home');
    };

    const handleLogout = () => {
        navigate('/inicio');
    };

    const handleAddProject = async () => {
        if (!projectName || !projectDescription || !projectImage) {
            alert("Por favor, completa todos los campos y selecciona una imagen.");
            return;
        }
    
        const formData = new FormData();
        formData.append("project_name", projectName);
        formData.append("description", projectDescription);
        formData.append("image", projectImage);
    
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch("http://localhost:3000/api/proyectos", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                // Refresca la lista de proyectos después de agregar uno nuevo
                fetchProjects();

                // Restablece los campos y cierra el popup
                setProjectName('');
                setProjectDescription('');
                setProjectImage(null);
                setProjectImageName('');
                setShowPopup(false);
            } else {
                const errorData = await response.json();
                console.error("Error creating project:", errorData.message || response.statusText);
                alert("Error creating project: " + (errorData.message || response.statusText));
            }
        } catch (error) {
            console.error("Request error:", error);
            alert("Request error: " + error.message);
        }
    };

    const handleDeleteProject = (index) => {
        setDeleteIndex(index);
        setConfirmDelete(true);
    };

    const confirmDeleteProject = () => {
        const updatedProjects = projects.filter((_, i) => i !== deleteIndex);
        setProjects(updatedProjects);
        setConfirmDelete(false);
    };

    const openEditPopup = (index) => {
        setEditIndex(index);
        setProjectName(projects[index].project_name);  // Ajuste para el nombre correcto
        setProjectDescription(projects[index].description); 
        setProjectImage(projects[index].image);
        setProjectImageName('');
        setShowEditPopup(true);
    };
    
    const handleEditProject = () => {
        const updatedProjects = projects.map((project, index) =>
            index === editIndex ? { 
                project_name: projectName, 
                description: projectDescription,
                image: projectImage || project.image 
            } : project
        );
        setProjects(updatedProjects);
        setShowEditPopup(false);
        setEditIndex(null);
        setProjectName('');
        setProjectDescription('');
        setProjectImage(null);
        setProjectImageName('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProjectImage(file); 
            setProjectImageName(file.name);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.profileCircle}>
                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/1256/1256650.png" 
                        alt="User Profile" 
                        style={styles.profileImage} 
                    />
                </div>
                <div style={styles.navItemContainer} onClick={() => navigate('/realhome')}>
                    <img src="https://cdn-icons-png.flaticon.com/128/4946/4946342.png" alt="Home Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Proyectos</p>
                </div>
                <div style={styles.navItemContainer} onClick={() => navigate('/calendario')}>
                    <img src="https://cdn-icons-png.flaticon.com/128/3652/3652267.png" alt="Calendar Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Calendario</p>
                </div>
                <div style={styles.navItemContainer} onClick={() => navigate('/roles')}>
                    <img src="https://cdn-icons-png.flaticon.com/128/5726/5726567.png" alt="Roles Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Roles</p>
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={styles.navItemContainer} onClick={handleLogout}>
                    <img src="https://cdn-icons-png.flaticon.com/128/1176/1176383.png" alt="Logout Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Cerrar Sesión</p>
                </div>
            </div>

            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Gestión de Proyectos</h1>
                    <button style={styles.addButton} onClick={() => setShowPopup(true)}>+ Nuevo Proyecto</button>
                </div>
                <p style={styles.description}>
                    A continuación, se muestra la lista de proyectos gestionados en el sistema. Aquí puedes crear, editar y eliminar proyectos según sea necesario.
                </p>
                
                <div style={styles.projectGrid}>
                    {projects.map((project, index) => (
                        <div key={index} style={styles.projectCard} onClick={goToProject}>
                            <div style={styles.projectIconContainer}>
                                <img src={project.image || 'https://cdn-icons-png.flaticon.com/128/8162/8162180.png'} alt="Project Icon" style={styles.uploadedImage} />
                            </div>
                            <p style={styles.projectText}>{project.project_name}</p>
                            <p style={styles.projectDescription}>{project.description}</p>
                            <div style={styles.cardButtons}>
                                <button style={styles.iconButton} onClick={(e) => {e.stopPropagation(); openEditPopup(index);}}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/3838/3838756.png" alt="Edit" style={styles.icon} />
                                </button>
                                <button style={styles.iconButton} onClick={(e) => {e.stopPropagation(); handleDeleteProject(index);}}>
                                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711573.png" alt="Delete" style={styles.icon} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
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
                        <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Descripción del proyecto"
                            style={styles.input}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                        {projectImageName && <p style={styles.fileName}>{projectImageName}</p>}
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={handleAddProject}>Agregar</button>
                            <button style={styles.closeButton} onClick={() => setShowPopup(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2 style={styles.popupTitle}>Editar Proyecto</h2>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Nombre del proyecto"
                            style={styles.input}
                        />
                        <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Descripción del proyecto"
                            style={styles.input}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                        {projectImageName && <p style={styles.fileName}>{projectImageName}</p>}
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={handleEditProject}>Guardar</button>
                            <button style={styles.closeButton} onClick={() => setShowEditPopup(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

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
    description: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '20px',
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
        width: '95px',
        height: '90px',
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
        width: '30px',
        height: '30px',
    },
    navItem: {
        fontWeight: '600',
        fontSize: '1rem',
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
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    projectText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: '10px',
    },
    projectDescription: {
        color: '#FFF',
        fontSize: '1rem',
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
    fileName: {
        fontSize: '0.9rem',
        color: '#333',
        marginTop: '10px',
    },
};

export default RealHome;
