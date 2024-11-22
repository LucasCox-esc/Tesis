import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importamos los íconos

export const Roles = ({ handleLogout }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('Usuario');
    const [newUserStatus, setNewUserStatus] = useState('Activo');
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const savedUsers = JSON.parse(localStorage.getItem('users')) || [
            { name: 'Juan Pérez', email: 'juan.perez@ejemplo.com', role: 'Administrador', status: 'Activo' },
            { name: 'Ana López', email: 'ana.lopez@ejemplo.com', role: 'Moderador', status: 'Activo' },
        ];
        const savedRoles = JSON.parse(localStorage.getItem('roles')) || ['Usuario', 'Moderador', 'Administrador'];
        setUsers(savedUsers);
        setFilteredUsers(savedUsers);
        setRoles(savedRoles);
    }, []);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('roles', JSON.stringify(roles));
    }, [roles]);

    const handleAddUser = () => {
        const newUser = {
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            status: newUserStatus,
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowAddPopup(false);
        resetForm();
    };

    const handleRoleChange = (index, newRole) => {
        const updatedUsers = [...users];
        updatedUsers[index].role = newRole;
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
    };

    const handleDeleteUser = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleEditUser = (index) => {
        setEditIndex(index);
        const user = users[index];
        setNewUserName(user.name);
        setNewUserEmail(user.email);
        setNewUserRole(user.role);
        setNewUserStatus(user.status);
        setShowEditPopup(true);
    };

    const handleSaveEditUser = () => {
        const updatedUsers = [...users];
        updatedUsers[editIndex] = {
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            status: newUserStatus,
        };
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowEditPopup(false);
        resetForm();
    };

    const resetForm = () => {
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('Usuario');
        setNewUserStatus('Activo');
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

            {/* Contenido principal */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Gestión de Roles</h1>
                    <div style={styles.buttonContainer}>
                        <button style={styles.addButton} onClick={() => setShowAddPopup(true)}>+ Agregar Trabajador</button>
                    </div>
                </div>
                <p style={styles.description}>
                    A continuación, se muestra la lista de trabajadores y sus roles en el sistema. Puedes gestionar permisos, editar información y eliminar trabajadores.
                </p>

                {/* Barra de búsqueda con icono de lupa */}
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Buscar trabajador"
                        style={styles.searchInput}
                    />
                    <span style={styles.searchIcon}>🔍</span>
                </div>

                {/* Tabla de usuarios */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nombre de Usuario</th>
                            <th style={styles.th}>Correo Electrónico</th>
                            <th style={styles.th}>Rol Actual</th>
                            <th style={styles.th}>Estado</th>
                            <th style={styles.th}>Editar Usuario</th>
                            <th style={styles.th}>Eliminar Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index} style={styles.row}>
                                <td style={styles.td}>{user.name}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(index, e.target.value)}
                                        style={styles.dropdown}
                                    >
                                        {roles.map((role, i) => (
                                            <option key={i} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={styles.td}>
                                    <span style={user.status === 'Activo' ? styles.activeStatus : styles.inactiveStatus}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.iconButton} onClick={() => handleEditUser(index)}>
                                        <FaEdit />
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.iconButtonDelete} onClick={() => handleDeleteUser(index)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup para agregar nuevo trabajador */}
            {showAddPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2 style={styles.popupTitle}>Agregar Nuevo Trabajador</h2>
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Nombre del trabajador"
                            style={styles.input}
                        />
                        <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            style={styles.input}
                        />
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value)}
                            style={styles.input}
                        >
                            {roles.map((role, index) => (
                                <option key={index} value={role}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={newUserStatus}
                            onChange={(e) => setNewUserStatus(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={handleAddUser}>Agregar</button>
                            <button style={styles.closeButton} onClick={() => setShowAddPopup(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup para editar trabajador */}
            {showEditPopup && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2 style={styles.popupTitle}>Editar Trabajador</h2>
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Nombre del trabajador"
                            style={styles.input}
                        />
                        <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            style={styles.input}
                        />
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value)}
                            style={styles.input}
                        >
                            {roles.map((role, index) => (
                                <option key={index} value={role}>{role}</option>
                            ))}
                        </select>
                        <select
                            value={newUserStatus}
                            onChange={(e) => setNewUserStatus(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                        <div style={styles.popupButtonContainer}>
                            <button style={styles.popupButton} onClick={handleSaveEditUser}>Guardar</button>
                            <button style={styles.closeButton} onClick={() => setShowEditPopup(false)}>Cancelar</button>
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
    },
    mainContent: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f3f6f9',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
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
        fontSize: '1rem',
        border: 'none',
    },
    searchInput: {
        padding: '10px',
        width: '100%',
        marginBottom: '20px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        backgroundColor: '#FFF',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '25px',
    },
    th: {
        padding: '12px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center', // Centrado en la cabecera
        verticalAlign: 'middle', // Alineación vertical
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
        color: '#333',
        textAlign: 'center',
        verticalAlign: 'middle', // Alineación vertical
    },
    row: {
        transition: 'background-color 0.3s',
        borderBottom: '1px solid #ddd',
    },
    rowHover: {
        backgroundColor: '#f1f1f1',
    },
    dropdown: {
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        fontSize: '1rem',
        outline: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
    },
    activeStatus: {
        display: 'inline-block',
        padding: '6px 12px',
        backgroundColor: '#28a745',
        color: '#FFF',
        borderRadius: '4px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '80px',
    },
    inactiveStatus: {
        display: 'inline-block',
        padding: '6px 12px',
        backgroundColor: '#6c757d',
        color: '#FFF',
        borderRadius: '4px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '80px',
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
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
    },
    popupButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    popupButton: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    closeButton: {
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: '#FFF',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
    },
    searchIcon: {
        position: 'absolute',
        right: '15px',
        top: '35%',
        transform: 'translateY(-50%)',
        fontSize: '18px',
        color: '#aaa',
    },
    editButton: {
        padding: '8px 16px',
        backgroundColor: '#ffc107',
        color: '#FFF',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
    },
    description: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '20px',
    },
    th: {
        padding: '12px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center', // Centrado en la cabecera
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
        color: '#333',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
    },
    searchInput: {
        padding: '10px 40px 10px 20px',
        width: '100%',
        marginBottom: '20px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    
    iconButton: {
        background: 'none',
        border: 'none',
        color: '#ffc107', // Amarillo para Editar
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    iconButtonDelete: {
        background: 'none',
        border: 'none',
        color: '#d9534f', // Rojo para Eliminar
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
};

export default Roles;

