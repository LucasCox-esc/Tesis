import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';


const Calendario = () => {
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    const [activities, setActivities] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newActivity, setNewActivity] = useState({ title: '', type: '', time: '', description: '' });
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const savedActivities = JSON.parse(localStorage.getItem('activities')) || {};
        setActivities(savedActivities);
    }, []);
    const handleLogout = () => {
        navigate('/inicio');
    };

    const handleDateChange = (date) => {
        setDate(date);
        setSelectedDate(format(date, "EEEE dd 'de' MMMM yyyy", { locale: es }));
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
    };

    const addActivity = () => {
        const updatedActivities = { 
            ...activities, 
            [selectedDate]: [...(activities[selectedDate] || []), newActivity] 
        };
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        setNewActivity({ title: '', type: '', time: '', description: '' });
        setShowModal(false);
    };

    const openEditActivity = (index) => {
        setEditMode(true);
        setEditIndex(index);
        const activityToEdit = activities[selectedDate][index];
        setNewActivity(activityToEdit);
        setShowModal(true);
    };

    const updateActivity = () => {
        const updatedActivities = { ...activities };
        updatedActivities[selectedDate][editIndex] = newActivity;
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        setNewActivity({ title: '', type: '', time: '', description: '' });
        setShowModal(false);
        setEditMode(false);
    };

    const deleteActivity = (index) => {
        const updatedActivities = { ...activities };
        updatedActivities[selectedDate].splice(index, 1);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setNewActivity({ title: '', type: '', time: '', description: '' });
    };

    const tileContent = ({ date, view }) => {
        const dateString = date.toDateString();
        if (view === 'month' && activities[dateString]) {
            return <div style={styles.dot}></div>;
        }
        return null;
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
                    <img src="https://cdn-icons-png.flaticon.com/128/3652/3652267.png" alt="Search Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Calendario</p>
                </div>
                <div style={styles.navItemContainer} onClick={() => navigate('/roles')}>
                    <img src="https://cdn-icons-png.flaticon.com/128/5726/5726567.png" alt="Roles Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Roles</p>
                </div>
                {/* Espaciador flexible */}
                <div style={{ flex: 1 }}></div>
                
                <div style={styles.navItemContainer} onClick={handleLogout}>
                    <img src="https://cdn-icons-png.flaticon.com/128/1176/1176383.png" alt="Logout Icon" style={styles.navIcon} />
                    <p style={styles.navItem}>Cerrar Sesión</p>
                </div>
            </div>
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Gestion de Actividades</h1>
                    <p style={styles.description}>Aquí puedes gestionar tus actividades diarias. Agrega, edita o elimina actividades según sea necesario.</p>
                </div>
                <div style={styles.contentContainer}>
                    <div style={styles.calendarContainer}>
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            tileContent={tileContent} 
                            locale="es"
                        />
                    </div>
                    <div style={styles.activityListContainer}>
                        <h3 style={styles.activityListTitle}>Actividades del día</h3>
                        <div style={styles.activitiesGrid}>
                            {(activities[selectedDate] || []).map((activity, index) => (
                                <div key={index} style={{ ...styles.activityItem, backgroundColor: getColor(activity.type) }}>
                                    <h4>{activity.title}</h4>
                                    <p><strong>Hora:</strong> {activity.time}</p>
                                    <p><strong>Descripción:</strong> {activity.description}</p>
                                    <div style={styles.activityButtons}>
                                        <button style={styles.iconButton} onClick={() => openEditActivity(index)}>
                                            <img src="https://cdn-icons-png.flaticon.com/128/3838/3838756.png" alt="Edit" style={styles.icon} />
                                        </button>
                                        <button style={styles.iconButton} onClick={() => deleteActivity(index)}>
                                            <img src="https://cdn-icons-png.flaticon.com/128/6711/6711573.png" alt="Delete" style={styles.icon} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div style={styles.popupOverlay}>
                        <div style={styles.popup}>
                            <h2 style={styles.popupTitle}>{editMode ? "Editar Actividad" : "Agregar Actividad"} para {selectedDate}</h2>
                            <input 
                                name="title" 
                                type="text" 
                                placeholder="Título de la actividad" 
                                value={newActivity.title} 
                                onChange={handleInputChange} 
                                style={styles.input}
                            />
                            <select 
                                name="type" 
                                value={newActivity.type} 
                                onChange={handleInputChange} 
                                style={styles.select}
                            >
                                <option value="">Tipo de actividad</option>
                                <option value="Reunión">Reunión</option>
                                <option value="Entrega">Entrega</option>
                                <option value="Tarea">Tarea</option>
                            </select>
                            <input 
                                name="time" 
                                type="time" 
                                value={newActivity.time} 
                                onChange={handleInputChange} 
                                style={styles.input}
                            />
                            <textarea 
                                name="description" 
                                placeholder="Descripción" 
                                value={newActivity.description} 
                                onChange={handleInputChange} 
                                style={styles.textarea}
                            />
                            <div style={styles.popupButtonContainer}>
                                <button onClick={editMode ? updateActivity : addActivity} style={styles.popupButton}>
                                    {editMode ? "Guardar Cambios" : "Agregar Actividad"}
                                </button>
                                <button onClick={closeModal} style={styles.closeButton}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const getColor = (type) => {
    switch (type) {
        case 'Reunión': return '#F4A261';
        case 'Entrega': return '#2A9D8F';
        case 'Tarea': return '#E9C46A';
        default: return '#D3D3D3';
    }
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
        backgroundColor: '#f3f6f9',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        marginBottom: '30px',
    },
    title: {
        fontSize: '2.2rem',
        color: '#333',
        fontWeight: '700',
    },
    description: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '20px',
    },
    contentContainer: {
        display: 'flex',
        gap: '20px',
    },
    calendarContainer: {
        flex: 1,
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFF',
    },
    dot: {
        height: '8px',
        width: '8px',
        backgroundColor: '#007BFF',
        borderRadius: '50%',
        margin: 'auto',
        marginTop: '5px',
    },
    activityListContainer: {
        flexBasis: '300px',
        backgroundColor: '#FFF',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',  // Agregamos overflow para el scroll
        maxHeight: '70vh',   // Limitar la altura de la lista para que no ocupe toda la pantalla
    },
    activityListTitle: {
        color: '#007BFF',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    activitiesGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    activityItem: {
        padding: '15px',
        borderRadius: '8px',
        color: '#333',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    activityButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
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
        width: '20px',
        height: '20px',
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
    popupTitle: {
        color: '#007BFF',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    select: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        resize: 'vertical',
        fontSize: '1rem',
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
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        border: 'none',
        flex: 1,
        marginRight: '10px',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: '#FFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        flex: 1,
        boxShadow: '0 4px 12px rgba(217, 83, 79, 0.3)',
    },
};

export default Calendario;
