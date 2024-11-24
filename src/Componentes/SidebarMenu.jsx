import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaProjectDiagram, FaCalendarAlt, FaUserShield, FaSignOutAlt } from 'react-icons/fa'; // Importando iconos de react-icons
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema alternativo
import { Button } from 'primereact/button';

const SidebarMenu = ({ onLogout }) => {
    const navigate = useNavigate();

    const styles = {
        sidebar: {
            width: '320px',
            backgroundColor: '#2074b6',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
        },
        profileCircle: {
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
        },
        profileImage: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
        },
        navItemContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            cursor: 'pointer',
        },
        navIcon: {
            marginRight: '10px',
            width: '30px',
            color: 'white', // Color blanco para los iconos
        },
        navItem: {
            color: '#fff',
            fontWeight: 'bold',
        },
    };

    return (
        <div style={styles.sidebar}>
            <div style={{ ...styles.profileCircle, marginTop: '20px' }}>
                <img
                    src="https://i.ibb.co/vQXfM11/455-Captura.png"
                    alt="User Profile"
                    style={styles.profileImage}
                />
            </div>

            <div style={{ marginTop: "60px" }}>
                <div style={{ marginBottom: "30px" }}>
                    <div style={styles.navItemContainer} onClick={() => navigate('/realhome')}>
                        <FaProjectDiagram style={{ ...styles.navIcon, fontSize: '20px', marginRight: '15px' }} />
                        <p style={{ ...styles.navItem, fontSize: '15px' }}>Proyectos</p>
                    </div>
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <div style={styles.navItemContainer} onClick={() => navigate('/calendario')}>
                        <FaCalendarAlt style={{ ...styles.navIcon, fontSize: '20px', marginRight: '15px' }} />
                        <p style={{ ...styles.navItem, fontSize: '15px' }}>Calendario</p>
                    </div>
                </div>

                <div style={styles.navItemContainer} onClick={() => navigate('/roles')}>
                    <FaUserShield style={{ ...styles.navIcon, fontSize: '20px', marginRight: '15px' }} />
                    <p style={{ ...styles.navItem, fontSize: '15px' }}>Roles</p>
                </div>
            </div>

            <div style={{ flex: 1 }}></div>
            <div style={styles.navItemContainer} onClick={() => navigate('/Inicio')}>
                <FaSignOutAlt style={styles.navIcon} />
                <p style={styles.navItem}>Cerrar Sesión</p>
            </div>
        </div>
    );
};

export default SidebarMenu;
