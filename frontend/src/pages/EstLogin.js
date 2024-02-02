import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';
import '../styles/Login.css';

export default function EstLogin() {
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/estudiantes/login`, { email: correo, password: contrasena });
      console.log('Server Response:', response);
      if (response.data.succes) {
        console.log("Sesión exitosa")            
        localStorage.setItem('correo', correo);
        localStorage.setItem('userType', 'estudiante');
        // localStorage.getItem() <-- Elimina esta línea
        navigate('/EstudianteMain', { replace: true });
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
          {/* Sistema de Estudiantes */}
          <div className="box-contenedor">
            <h1 className="titulo-Sistema">Sistema de Calificaciones</h1>
            <h1 className="titulo-Iniciar">Iniciar Sesión</h1>
            <form onSubmit={(e) => handleLogin(e)}>
              <div className="mb-3">
                <label htmlFor="estudiante-correo" className="lbl-correo">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  className="campo-correo"
                  id="estudiante-correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="estudiante-contrasena" className="lbl-contrasena">
                  Contraseña:
                </label>
                <input
                  type="password"
                  className="campo-contrasena"
                  id="estudiante-contrasena"
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
