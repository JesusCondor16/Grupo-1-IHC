import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URL } from '../config.js';
import '../styles/Main.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfesorMain() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();  
  useEffect(() => {    
    const fetchData = async () => {
      try {
        const correo = localStorage.getItem('correo');
        const response = await axios.get(`${API_URL}/profesores/${correo}`);
        setUserData(response.data);
      } catch (error) {
        setError('Error al obtener datos del profesor');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  
    // Agregar un registro de la ubicación actual después de la alerta
    console.log('Ubicación actual:', window.location.pathname);
  }, []);

  return (
    <div className='dashboard-contenedor'>
      <Helmet>
        <title>Bienvenido Profesor</title>
      </Helmet>      
      <h1 style={{ textAlign: 'center' }}>Bienvenido al Sistema de Estudiantes y Calificaciones</h1>
      <div className="contenedor-perfil">
        {userData && (
          <div>
            <div>
              <AccountCircleIcon fontSize="100" className="icono-perfil" />
            </div>
            <h2 style={{ textAlign: 'center' }}>Datos del Profesor:</h2>
            <p style={{ textAlign: 'center' }}>Correo: {userData.email}</p>            
          </div>
        )}
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};