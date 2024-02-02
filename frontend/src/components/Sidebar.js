import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';
import { SidebarDataE } from './SidebarDataE';
import { SidebarDataP } from './SidebarDataP';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { API_URL } from '../config.js';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AgregarAlumno from '../pages/AgregarAlumno';

export default function Sidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const correo = localStorage.getItem('correo');
        const response = await axios.get(`${API_URL}/estudiantes/${correo}`);
        setUserData(response.data);
      } catch (error) {
        setError('Error al obtener datos del estudiante');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('correo');
    localStorage.removeItem('userType');
    navigate('/');
  };

  // Determine whether to show the sidebar based on the current route
  const isLoginRoute = location.pathname === '/' || location.pathname === '/login-profesor' || location.pathname === '/login-estudiante';
  if (isLoginRoute) {
    return null; // Don't render the sidebar on login pages
  }

  const isDelegado = userData && userData.isDelegado;

  // Determine which set of sidebar data to use based on the user type
  const userType = localStorage.getItem('userType');
  const sidebarData = userType === 'profesor' ? SidebarDataP : SidebarDataE;

  return (
    <div className={`Sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        <MenuIcon />
      </div>
      {isSidebarExpanded && (
        <ul className="SidebarList">
          {sidebarData.map((val, key) => (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? 'active' : ''}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          ))}
          {isDelegado && (
            <li className="row" onClick={() => navigate('/AgregarAlumno')}>
            <div id="icon">{<PersonAddIcon />}</div>
            <div id="title">Agregar Alumno</div>
          </li>
          )}
          <li className="row" onClick={handleLogout}>
            <div id="icon">{<LogoutIcon />}</div>
            <div id="title">Cerrar Sesión</div>
          </li>
        </ul>
      )}
    </div>
  );
}