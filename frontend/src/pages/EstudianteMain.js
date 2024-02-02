import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { API_URL } from '../config.js';
import '../styles/Main.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const EstudianteMain = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  }, []);  // El array vacío asegura que useEffect solo se ejecute una vez, similar a componentDidMount

  return (
    <div className='dashboard-contenedor'>
      <Helmet>
        <title>Bievenido alumno</title>
      </Helmet>      
        <h1 style={{ textAlign: 'center' }}>Bienvenido al Sistema de Estudiantes y Calificaciones</h1>
        <div className="contenedor-perfil">
        {userData && (
            <div>
        <div>
            <AccountCircleIcon fontSize="100" className="icono-perfil" />
        </div>
            <h2 style={{ textAlign: 'center' }}>Datos del Estudiante:</h2>            
            <p style={{ textAlign: 'center' }}>DNI: {userData.dni}</p>
            <p style={{ textAlign: 'center' }}>Nombre: {userData.nombre}</p>
            <p style={{ textAlign: 'center' }}>Apellido Paterno: {userData.apellido_pat}</p>
            <p style={{ textAlign: 'center' }}>Apellido Materno: {userData.apellido_mat}</p>
            <p style={{ textAlign: 'center' }}>Telefono: {userData.telefono}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteMain;
