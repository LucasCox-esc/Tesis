import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';

const Calendario = () => {
    const [date, setDate] = useState(new Date());
    const [notas, setNotas] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const savedNotas = JSON.parse(localStorage.getItem('notas')) || {};
        setNotas(savedNotas);
    }, []);

    const handleDateChange = (date) => {
        setDate(date);
        setSelectedDate(date.toDateString());
    };

    const handleNoteChange = (event) => {
        const newNotes = { ...notas, [selectedDate]: event.target.value };
        setNotas(newNotes);
        localStorage.setItem('notas', JSON.stringify(newNotes));
    };

    const handleMonthChange = (direction) => {
        const newDate = new Date(date.setMonth(date.getMonth() + direction));
        setDate(newDate);
    };

    // Comprobar si el día tiene una nota
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toDateString();
            return notas[dateString] ? 'has-note' : null;
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
            </div>
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <button onClick={() => handleMonthChange(-1)} style={styles.navButton}>←</button>
                    <h1 style={styles.title}>{date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h1>
                    <button onClick={() => handleMonthChange(1)} style={styles.navButton}>→</button>
                </div>
                <div style={styles.calendarContainer}>
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        tileClassName={tileClassName} // Asignar clase según si hay nota
                    />
                </div>
                {selectedDate && (
                    <div style={styles.noteSection}>
                        <h2 style={styles.noteTitle}>Notas para {selectedDate}</h2>
                        <textarea
                            style={styles.noteInput}
                            value={notas[selectedDate] || ''}
                            onChange={handleNoteChange}
                            placeholder="Escribe una nota aquí"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f5f5f5',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#007BFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        color: '#FFF',
        boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
    },
    profileCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#FFF',
        marginBottom: '20px',
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
        margin: '10px 0',
        cursor: 'pointer',
        color: '#FFF',
    },
    navIcon: {
        width: '24px',
        height: '24px',
    },
    navItem: {
        fontWeight: '600',
        fontSize: '1rem',
        color: '#FFF',
    },
    mainContent: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#fff',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
    },
    title: {
        fontSize: '1.8rem',
        color: '#333',
        fontWeight: '600',
    },
    navButton: {
        backgroundColor: '#F3F4F6',
        border: '1px solid #ddd',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    calendarContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    noteSection: {
        marginTop: '20px',
        backgroundColor: '#f8f8f8',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '80%',
        maxWidth: '600px',
        textAlign: 'center',
    },
    noteTitle: {
        fontSize: '1.5rem',
        color: '#333',
        fontWeight: '600',
    },
    noteInput: {
        width: '100%',
        minHeight: '100px',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        resize: 'vertical',
    },
};

export default Calendario;
