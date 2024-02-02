// Editar.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import '../styles/Editar.css';

const Editar = () => {
  const email = localStorage.getItem('correo');

  const [estudiante, setEstudiante] = useState({
    codigo: '',
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    telefono: '',
    email: '',
    isDelegado: false,
  });

  const [edicionHabilitada, setEdicionHabilitada] = useState(false);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const response = await fetch(`${API_URL}/estudiantes/${email}`);
        const data = await response.json();
        setEstudiante(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchEstudiante();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstudiante((prevEstudiante) => ({
      ...prevEstudiante,
      [name]: name === 'telefono' ? value.replace(/\D/g, '') : value,
    }));
  };

  const handleHabilitarEdicion = () => {
    // Verifica si el usuario es un delegado antes de habilitar la edición completa
    if (estudiante.isDelegado) {
      setEdicionHabilitada(true);
    } else {
      // Si no es un delegado, solo se habilita la edición del campo de teléfono
      setEdicionHabilitada((prevEdicionHabilitada) => !prevEdicionHabilitada);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lógica para enviar la información actualizada al servidor
      // Puedes utilizar fetch o axios para realizar la solicitud PUT
      // Ajusta esto según la estructura de tu API
      const response = await fetch(`${API_URL}/estudiantes/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estudiante),
      });
      const data = await response.json();
      console.log('Estudiante actualizado:', data);
    } catch (error) {
      console.error('Error updating student data:', error);
    }
  };

  return (
    <div className="contenedor-editar">
      <h1>Editar Perfil</h1>
      <button onClick={handleHabilitarEdicion}>
        Habilitar Edición
      </button>
      <form onSubmit={handleSubmit}>
        <label>
          Código:
          <input
            type="text"
            name="codigo"
            value={estudiante.codigo}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={estudiante.nombre}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        <label>
          Apellido Paterno:
          <input
            type="text"
            name="apellido_pat"
            value={estudiante.apellido_pat}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        <label>
          Apellido Materno:
          <input
            type="text"
            name="apellido_mat"
            value={estudiante.apellido_mat}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={estudiante.telefono}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={estudiante.email}
            onChange={handleInputChange}
            disabled={!edicionHabilitada}
          />
        </label>
        {estudiante.isDelegado && (
          <label>
            Delegado:
            <input
              type="checkbox"
              name="isDelegado"
              checked={estudiante.isDelegado}
              onChange={handleInputChange}
              disabled={!edicionHabilitada}
            />
          </label>
        )}
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default Editar;
