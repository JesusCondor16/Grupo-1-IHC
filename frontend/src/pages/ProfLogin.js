import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import '../styles/Login.css';

export default function ProfLogin() {
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/profesores/login`, { email: correo, password: contrasena });
      if (response.data.succes===true) {                
        localStorage.setItem('correo', correo);
        localStorage.setItem('userType', 'profesor');
        localStorage.setItem('userData', JSON.stringify(response.data.userData));
        console.log('Before navigation');
        navigate('/ProfesorMain', { replace: true });
        console.log('After navigation');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error en el inicio de sesión');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="fondo-celeste"></div>
      <div className="login-contenedor">
        <div className="contenedor-horizontal">
          <div className="box-contenedor">
            <h1 className="titulo-Sistema">Sistema de Calificaciones</h1>
            <h1 className="titulo-Iniciar">Iniciar Sesión</h1>
            <form onSubmit={(e) => handleLogin(e)}>
              <div className="mb-3">
                <label htmlFor="profesor-correo" className="lbl-correo">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  className="campo-correo"
                  id="profesor-correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="profesor-contrasena" className="lbl-contrasena">
                  Contraseña:
                </label>
                <input
                  type="password"
                  className="campo-contrasena"
                  id="profesor-contrasena"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-IniciarSesion">
                Iniciar Sesión
              </button>
              {error && <p className="text-danger">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
